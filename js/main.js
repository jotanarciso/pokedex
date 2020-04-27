$(document).ready(function () {
  /* start interface  */
  setTimeout(function () {
    $("#pokeball").fadeOut("slow", function () {
      $("#bg-loading").fadeOut("slow");
    });
  }, 2000);

  /* 
  **************************************************************************
  **************************************************************************
  thanks simon goellner for providing the code and saving my time 
  link: https://codepen.io/simeydotme/pen/PrQKgo 
  */

  var $cards = $(".card");
  var $style = $(".hover");
  $cards
    .on("mousemove", function (e) {
      var $card = $(this);
      var l = e.offsetX;
      var t = e.offsetY;
      var h = $card.height();
      var w = $card.width();
      var lp = Math.abs(Math.floor((100 / w) * l) - 100);
      var tp = Math.abs(Math.floor((100 / h) * t) - 100);
      var bg = `background-position: ${lp}% ${tp}%;`;
      var style = `.card.active:before { ${bg} }`;
      $cards.removeClass("active");
      $card.addClass("active");
      $style.html(style);
    })
    .on("mouseout", function () {
      $cards.removeClass("active");
    });

  /*
   **************************************************************************
   **************************************************************************
   */

  /* end interface  */

  /* start operation */

  const searchBox = document.getElementById("search-box");
  const searchButton = document.getElementById("search-button");
  const testButton = document.getElementById("test-button");

  searchButton.addEventListener("click", function () {
    findPokemon();
  });

  testButton.addEventListener("click", function () {
    testPokemons(true);
  });

  searchBox.addEventListener("keypress", function (e) {
    if (e.which == 13) {
      findPokemon();
    }
  });

  async function findPokemon(test, pokemonTest) {
    var pokemon;
    if (!test) {
      pokemon = searchBox.value.toLowerCase();
      searchBox.value = "";
    } else {
      // if test use param
      $("#test-button").attr("disabled", true);
      testButton.innerHTML = "Waiting finish...";
      pokemon = pokemonTest;
      searchBox.value = pokemonTest;
    }

    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    await data.json().then((response) => {
      // console.log(response) // test
      displayPokemon(response);
    });
  }

  function displayPokemon(pokemon) {
    const pokemonImg = document.getElementById("pokemon-img");
    const pokemonName = document.getElementById("pokemon-name");
    const pokemonId = document.getElementById("pokemon-id");
    const pokemonXP = document.getElementById("pokemon-xp");
    const pokemonHeight = document.getElementById("pokemon-height");
    const pokemonWeight = document.getElementById("pokemon-weight");
    const pokemonAbilities = document.getElementById("pokemon-abilities");
    const pokemonForms = document.getElementById("pokemon-forms");
    const pokemonType = document.getElementById("pokemon-type");

    /* manipulating DOM and entering data */
    pokemonImg.src = pokemon.sprites["front_default"];
    pokemonName.innerHTML = correctData(pokemon.name);
    pokemonId.innerHTML = "#" + pokemon.id;
    pokemonXP.innerHTML = pokemon.base_experience;
    pokemonHeight.innerHTML = pokemon.height;
    pokemonWeight.innerHTML = pokemon.weight;

    /* abilities */
    let abilities = "";
    for (var i in pokemon.abilities) {
      // entering all abilities
      abilities +=
        "<p class='tag'>" +
        correctData(pokemon.abilities[i].ability.name) +
        "</p>";
    }

    pokemonAbilities.innerHTML = ""; // clean abilities
    pokemonAbilities.innerHTML = abilities;

    /* forms */
    let forms = "";
    for (var i in pokemon.forms) {
      // entering all forms
      forms += "<p class='tag'>" + correctData(pokemon.forms[i].name) + "</p>";
    }

    pokemonForms.innerHTML = ""; // clean forms
    pokemonForms.innerHTML = forms;

    /* types */
    let types = "";
    for (var i in pokemon.types) {
      // entering all types
      types += `<a data-toggle="tooltip" data-placement="top"
      title="${correctData(
        pokemon.types[i].type.name
      )}"><img src="./img/icons/${pokemon.types[i].type.name}.png"/></a>`;
    }

    pokemonType.innerHTML = ""; // clean types
    pokemonType.innerHTML = types;
  }

  function correctData(string) {
    // optimize string
    if (/[-]/.test(string)) {
      return correctData(string.replace(/-/g, "&nbsp"));
    } else {
      return string
        .toLowerCase()
        .split("&nbsp")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
  }
  /* end operation  */

  async function testPokemons(test) {
    const testTime = 1000; // time (seconds) between test requests
    const qtd = 20; // amount of pokemon to test
    var pokemonsTested = [];
    var index = 0;
    var time = setInterval(checkAllPokemons, testTime);

    if (test) {
      const pokemons = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${qtd}`
      );
      await pokemons.json().then((response) => {
        pokemonsTested = response.results;
        checkAllPokemons();
      });
    } else {
      stopTest();
    }

    async function checkAllPokemons() {
      findPokemon((test = true), pokemonsTested[index].name);
      index++;
      if (index === pokemonsTested.length) {
        stopTest();
        testButton.innerHTML = "Test finished!";
      }
    }

    function stopTest() {
      clearInterval(time);
    }
  }
});
