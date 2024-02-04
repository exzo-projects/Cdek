const calcForm = document.querySelector("#compare-form");
const calcBtn = document.querySelector(".calc-btn");

const calculator = () => {
  return {
    data: {
      cityFrom: "Москва",
      cityFromCode: "44",
      cityToCode: "137",
      cityTo: "Санкт-Петербург",
      weight: "3",
      dlength: "30",
      width: "20",
      height: "5",
      worth: "",
      cod: false,
    },

    resultsFrom: "",
    resultsTo: "",
    results: "",

    async calc() {
      calcBtn.classList.add("process");
      const response = await fetch(
        `/compare.php?from=${this.data.cityFromCode}&to=${this.data.cityToCode}&weight=${this.data.weight}&dlength=${this.data.dlength}&width=${this.data.width}&height=${this.data.height}&cod=${this.data.cod}&worth=${this.data.worth}`
      );
      calcBtn.classList.remove("process");
      const result = await response.json();
      this.results = result;
      this.directions();
    },

    autocompleteCity(query, direction) {
      if (query != "") {
        $.ajax({
          url: "https://api.cdek.ru/city/getListByTerm/jsonp.php?callback=?",
          dataType: "jsonp",
          data: {
            q: query,
            name_startsWith: query,
          },
          success: (result) => {
            this.resultsFrom = "";
            this.resultsTo = "";

            switch (direction) {
              case "from": {
                const menuEl = document.querySelector("#autocomplete-from");
                menuEl.classList.add("open");
                this.resultsFrom = result.geonames;
                break;
              }
              case "to": {
                const menuEl = document.querySelector("#autocomplete-to");
                menuEl.classList.add("open");
                this.resultsTo = result.geonames;
                break;
              }
            }
          },
        });
      }
    },

    selectCity(el, direction) {
      this.closeHint();

      switch (direction) {
        case "from": {
          this.data.cityFrom = el.textContent;
          this.data.cityFromCode = el.id;
          break;
        }
        case "to": {
          this.data.cityTo = el.textContent;
          this.data.cityToCode = el.id;
          break;
        }
      }
    },

    closeHint() {
      document.querySelector("#autocomplete-to").classList.remove("open");
      document.querySelector("#autocomplete-from").classList.remove("open");
      this.resultsFrom = "";
      this.resultsTo = "";
    },

    directions() {
      const dirText = document.getElementById("directions");
      dirText.textContent = `${this.data.cityFrom} → ${this.data.cityTo}`;
    },

    formatResult(value) {
      if (typeof value == "undefined") {
        return "<strong>0</strong> <small>₽</small>";
      } else if (value == false) {
        return `<i class="icon-none"></i>`;
      } else {
        return `<strong>${Math.ceil(value)}</strong> <small>₽</small>`;
      }
    },

    formatDays(min, max) {
			if (typeof min === "undefined") {
				return "&nbsp;";
			} else if (min === max) {
				const pluralSuffix = (max > 1) ? 'дня' : 'день';
				return `${max} ${pluralSuffix}`;
			} else {
				const pluralSuffix = (max > 4) ? 'дней' : 'дня';
				return `${min} - ${max} ${pluralSuffix}`;
			}
    },
  };
};
