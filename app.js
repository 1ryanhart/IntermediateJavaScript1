//global variables for the height and weight units - to change the input form (metric or imperial input)
let unitsHeightMetric = false
let unitsWeightMetric = false

// Selects random fact from dyno fact array, and ensures that new fact is not the same as the previously displayed fact
function randomItem(species,factArray, currentFact = '') {
    if (species == 'Pigeon') {
        return factArray[0];
    } else if (currentFact=='') {
        return factArray[Math.floor(Math.random()*factArray.length)]
    } else {
        let updatedFactArray = [...factArray]
        updatedFactArray.splice(updatedFactArray.indexOf(currentFact), 1);
        return updatedFactArray[Math.floor(Math.random()*updatedFactArray.length)]
    }
}

// This object is used by the dynoCompare function for one of the generated facts 
ageLookup = {
    "Late Cretaceous": "100.5 - 66 million years ago",
    "Late Jurassic": "163.5 (+/- 1) - 145.5 million years ago",
    "Late Jurassic to Early Cretaceous": "roughly 145 million years ago"
}

/**
* @description Represents a dinosaur
* @constructor
* @param {array} dino - An array of dinosaurs
*/
function Dino(dino) {
    this.species = dino.species
    this.weight = dino.weight;
    this.height = dino.height;
    this.diet = dino.diet;
    this.where = dino.where;
    this.when = dino.when;
    this.fact = dino.fact
}

// Creates Dino Objects from dino.json file
let dinoArray = [];
fetch('./dino.json')
    .then(response => response.json())
    .then(data => {
        dinoArray = data.Dinos.map(dino => new Dino(dino));
});

/**
* @description Represents a human
* @constructor
*/
function Human() {
    this.species = 'human';
    this.image = "images/human.png"
}

const human = new Human();

// This creates and appends more facts to each dinosaur's fact array, in addition to the one fact each dinosaur already has
function dynoCompare (dyno, human) {
    let comparrison1 = 'smaller';
    let comparrison2 = 'lighter';
    let comparrison3 = 'shorter';
    let comparrison4 = '';
    let comparrison5 = 'lower';
    let dynoBMI = bmiCalculator(dyno.height, dyno.weight);

    if (dyno.height > human.height) {
        comparrison1 = 'taller'
    } 
    if (dyno.weight > human.weight) {
        comparrison2 = 'heavier'
    } 
    if (dyno.species.length > human.name.length) {
        comparrison3 = 'longer'
    } 
    if (dyno.diet == human.diet) {
        comparrison4 = 'also '
    } 
    if (dynoBMI > human.bmi ) {
        comparrison5 = 'higher'
    }

    dyno.fact.push(`This dynosaur is ${comparrison1} than you are by ${Math.abs(dyno.height - human.height)}"`);
    dyno.fact.push(`This dynosaur is ${comparrison2} than you are by ${Math.abs(dyno.weight - human.weight)}lbs`);
    dyno.fact.push(`This dynosaur's species name is ${comparrison3} than your name (by ${Math.abs(dyno.species.length - human.name.length)} characters)`);
    dyno.fact.push(`This dynosaur is a ${dyno.diet} and you are ${comparrison4}a ${human.diet}`);
    dyno.fact.push(`The ${dyno.species} lived ${ageLookup[dyno.when]}`);
    dyno.fact.push(`The ${dyno.species} has a ${comparrison5} BMI compared to you (${dynoBMI} vs. ${human.bmi})`);
}

// resetOption is the text that appears allowing the user to reset the page to the input form
const resetOption = document.getElementById('reset');
const form = document.getElementById('dino-compare');

/**
* @description IIFE. Takes infor form data and generates the 9 tiles on the page
* @param {array} array - An array of dinosaurs
*/
const createGrid = function(array) {
    (function(human) {
        let nameValue = document.getElementById('name').value;
        let heightFeetValue = parseInt(document.getElementById('feet').value);
        let heightInchesValue = parseInt(document.getElementById('inches').value);
        let weightValue = parseInt(document.getElementById('weight').value);
        let dietValue = document.getElementById('diet').value.toLowerCase();

        //Human properties are updated here based on input form. Ternary operators to account for metric or imperial input
        human.name = nameValue;
        human.weight = (unitsWeightMetric) ? Math.floor(weightValue*2.20462): weightValue;
        human.height = (unitsHeightMetric) ? Math.floor(heightFeetValue*0.393701) :heightFeetValue*12 + heightInchesValue;
        human.diet = dietValue;
        human.bmi = bmiCalculator(human.height,human.weight);

        //Hides the input form and shows the text 'Click to start over'
        form.classList.add('hidden');
        resetOption.classList.remove('hidden');


        mainGrid = document.getElementById('grid');

        //Generates tiles for each Dino in Array plus the human tile in the centre
        for (let i = 0; i < 8; i++) {
        //Use a 'gridIndex', to allow human to be placed in the middle of the dynosaur grid
            let gridIndex = i;
            if (i >= 4) {
                gridIndex = i+1
            }
        // Creates the human tile
            if (i==4) {
                let newDiv = document.createElement('div');
                newDiv.classList.add('grid-item');
                newDiv.setAttribute('id',`grid-item:nth-child(4)`);
                newDiv.innerHTML = `
                    <h3>${human.name}</h3>
                    <img src="${human.image}" alt='human image'>
                    <div class="info-bar">
                    <span class="hidden" data-id=${i}>Height: ${Math.floor(human.height/12)}'${human.height%12}"<br/>Weight: ${human.weight}lb</span>
                </div>`;

                newDiv.addEventListener ('mouseenter', () => {
                    extraInfo = document.getElementById(`grid-item:nth-child(4)`).getElementsByTagName('span')[0]
                    extraInfo.classList.remove("hidden")
                });

                newDiv.addEventListener ('mouseleave', () => {
                    extraInfo = document.getElementById(`grid-item:nth-child(4)`).getElementsByTagName('span')[0]
                    extraInfo.classList.add("hidden")
                });

                mainGrid.appendChild(newDiv);
            }

            //To create the additional facts for the dinosaur
            dynoCompare(array[i],human);

            // Creates all the dino tiles
            let newDiv = document.createElement('div');
            newDiv.classList.add('grid-item');
            newDiv.setAttribute('id',`grid-item:nth-child(${gridIndex})`);
            newDiv.innerHTML = `
                <h3>${array[i].species}</h3>
                <img src="images/${array[i].species}.png" alt=${array[i].species}>
                <div class="info-bar"><p data-id=${i}>${randomItem(array[i].species,array[i].fact)}</p>
                <span class="hidden" data-id=${i}><br/><br/>From: ${array[i].where}<br/>Height: ${Math.floor(array[i].height/12)}'${array[i].height%12}"<br/>Weight: ${array[i].weight}lb</span>
                </div>`;

            //Allow the user to display new random fact by clicking on the tile
            newDiv.addEventListener ('click', () => {
                factParagraph = document.getElementById(`grid-item:nth-child(${gridIndex})`).getElementsByTagName('p')[0];
                let i = factParagraph.getAttribute('data-id');
                factParagraph.innerHTML = `${randomItem(array[i].species,array[i].fact,factParagraph.innerText)}`
            });
    
            newDiv.addEventListener ('mouseenter', () => {
                extraInfo = document.getElementById(`grid-item:nth-child(${gridIndex})`).getElementsByTagName('span')[0];
                extraInfo.classList.remove("hidden")
            });

            newDiv.addEventListener ('mouseleave', () => {
                extraInfo = document.getElementById(`grid-item:nth-child(${gridIndex})`).getElementsByTagName('span')[0];
                extraInfo.classList.add("hidden")
            });

        mainGrid.appendChild(newDiv);
        }
    })(human);
} 

/**
 * @description Validates input form. Displays alert if missing or invalid data
 */
function validateForm () {
    let nameValue = document.getElementById('name').value;
    let heightFeetValue = parseInt(document.getElementById('feet').value);
    let heightInchesValue = parseInt(document.getElementById('inches').value);
    let weightValue = parseInt(document.getElementById('weight').value);

    let message = '';
    let proceed = true;

    if (nameValue == '') {
        message += 'Please enter your name\n';
        proceed = false
    }
    //if the units are metric, then you only need the leftmost box filled in (which now represents cm)
    if (unitsHeightMetric) {  
        if (heightFeetValue <=0 || isNaN(heightFeetValue)) {
            message += 'Please enter a valid height\n';
            proceed = false
        }
    } else {
        if (heightFeetValue <0 || isNaN(heightFeetValue) || heightInchesValue <0 || isNaN(heightInchesValue)) {
            message += 'Please enter a valid height\n';
            proceed = false
        }
    }

    if (isNaN(weightValue)) {
        message += 'Please enter a valid weight\n';
        proceed = false
    }

    if (proceed) {
        createGrid(shuffle(dinoArray))
    } else {
        alert(message)
    }
}

const submitButton = document.getElementById('btn');
submitButton.addEventListener('click', validateForm);

//Reset the data and show the input form again
resetOption.addEventListener('click', () => {
    form.classList.remove('hidden');
    resetOption.classList.add('hidden');
    document.getElementById('name').value = '';
    document.getElementById('feet').value = '';
    document.getElementById('inches').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('diet').value = 'Herbivore';
    document.getElementById('grid').innerHTML=''
})

/**
* @description Calculates BMI (body mass index) in kg/m^2.
* @param {number} height - Height in cm
* @param {number} weight - Weight in kg
*/
function bmiCalculator(height,weight) {
    let heightMeters = height*0.0254;
    let weightKilograms = weight*0.453592;
    return parseInt((weightKilograms/(heightMeters*heightMeters)).toFixed(1))
}

//Allowing the user to switch between metric and imperial individually for the height and weight
const switchHeight = document.getElementById('switchHeight');
const switchWeight = document.getElementById('switchWeight');

switchHeight.addEventListener('click', () => {
    let inchesLabel = document.getElementById('inches-label');
    unitsHeightMetric = (unitsHeightMetric) ? false : true ;
    let heightTextLabel = document.getElementById('feet-label');

    if (unitsHeightMetric) {
        switchHeight.innerText= 'Switch to ft, in';
        heightTextLabel.innerHTML= 'cm: <input id="feet" class="form-field__short" type="number" name="feet">';
        inchesLabel.classList.add('hidden')
    } else {
        switchHeight.innerText= 'Switch to cm';
        heightTextLabel.innerHTML= 'Feet: <input id="feet" class="form-field__short" type="number" name="feet">';
        inchesLabel.classList.remove('hidden')
    } 
})

switchWeight.addEventListener('click', () => {
    unitsWeightMetric = (unitsWeightMetric) ? false : true;
    let weightTextLabel = document.getElementById('lb-label');

    if (unitsWeightMetric) {
        switchWeight.innerText= 'Switch to lb';
        weightTextLabel.innerHTML= '<input id="weight" class="form-field__full" type="number" name="weight">kgs'
    } else {
        switchWeight.innerText= 'Switch to kg';
        weightTextLabel.innerHTML= '<input id="weight" class="form-field__full" type="number" name="weight">lbs'
    }
})

//Shuffles the dino array for random tile generation
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
  
      // Pick a remaining element
      randomIndex = Math.floor(Math.random()*currentIndex);
      currentIndex--;
      // And swap it with the current element
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}



