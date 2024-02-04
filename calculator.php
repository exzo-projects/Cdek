<?php
require_once 'vendor/autoload.php';

$client = new \CdekSDK\CdekClient('SECRET', 'SECRET');

use CdekSDK\Requests;

$uri = $_SERVER['REQUEST_URI'];

$from = $_GET['from'];
$to = $_GET['to'];
$width = $_GET['width'];
$dlength = $_GET['dlength'];
$weight = $_GET['weight'];
$height = $_GET['height'];
$worth = $_GET['worth'];
$cod = $_GET['cod'];

if (empty($from) || empty($to) || empty($width) || empty($dlength) || empty($weight) || empty($height)) {
	return;
}

if (empty($worth)) {
	$worth = 0;
}

$request = new Requests\CalculationWithTariffListAuthorizedRequest();
$request
	->setSenderCityId($from)
	->setReceiverCityId($to)
	->addAdditionalService(2, $worth)

	->addTariffToList(139) // ИМ Д-Д
	->addTariffToList(137) // ИМ С-Д
	->addTariffToList(136) // ИМ С-С
	->addTariffToList(1) // Лайт Д-Д
	->addTariffToList(11) // Лайт С-Д
	->addTariffToList(10) // Лайт С-С
	->addTariffToList(62) // Маг. Экспресс С-С
	->addTariffToList(5) // Эконом экспр. С-С

	->addPackage([
		'weight' => $weight,
		'length' => $dlength,
		'width'  => $width,
		'height' => $height,
	]);

$response = $client->sendCalculationWithTariffListRequest($request);

$data = [];

foreach ($response->getResults() as $result) {

	if ($result->hasErrors()) {
		$key = "id_" . $result->getTariffId();
		$value = false;
		$data[$key] = $value;
		continue;
	}

	if (!$result->getStatus()) {
		continue;
	}

	if ($cod && intval($worth) > 0) {
		$sum = intval($worth) + intval($result->getPrice());
		$percent = ($sum * 3) / 100;
		$calcPrice = $sum + $percent + 1;

		$key = "id_" . $result->getTariffId();
		$value = $calcPrice;
		$data[$key] = $value;
	} else {
		$key = "id_" . $result->getTariffId();
		$value = $result->getPrice();
		$data[$key] = $value;
	}

	$key = "min_id_" . $result->getTariffId();
	$value = $result->getDeliveryPeriodMin();
	$data[$key] = $value;

	$key = "max_id_" . $result->getTariffId();
	$value = $result->getDeliveryPeriodMax();
	$data[$key] = $value;
}

echo json_encode($data);
