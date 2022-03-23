// Random item generator for dyno fact array
function randomItem(species,factArray, currentFact="")
{
    if (species == 'Pigeon') {
        return factArray[0];
    } else {
        let updatedFactArray = [...factArray]
        updatedFactArray.splice(updatedFactArray.indexOf(currentFact), 1 );
        return updatedFactArray[Math.floor(Math.random()*updatedFactArray.length)]
    }
}

// 
ageLookup = {
    "Late Cretaceous": "100.5 - 66 million years ago",
    "Late Jurassic": "163.5 (+/- 1) - 145.5 million years ago",
    "Late Jurassic to Early Cretaceous": "roughly 145 million years ago"
}

// Create Dino Constructor
function Dino(dino) {
    this.species = dino.species
    this.weight = dino.weight;
    this.height = dino.height;
    this.diet = dino.diet;
    this.where = dino.where;
    this.when = dino.when;
    this.fact = dino.fact
}

// Create Dino Objects
let dinoArray = [];
fetch('./dino.json')
    .then(response => response.json())
    .then(data => {
        dinoArray = data.Dinos.map(dino => new Dino(dino));
});

// Create Human Object
let submitButton = document.getElementById('btn');

function Human() {
    this.species = 'human';
    this.image = "images/human.png"
}

let human = new Human()

// Use IIFE to get human data from form

function dynoCompare (dyno, human) {
    let comparrison1 = 'smaller'
    let comparrison2 = 'lighter'
    let comparrison3 = 'shorter'
    let comparrison4 = ''
    let comparrison5 = 'lower'
    let dynoBMI = bmiCalculator(dyno.height, dyno.weight)

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
        comparrison4 == 'also'
    } 
    if (dynoBMI > human.bmi ) {
        comparrison5 = 'higher'
    }

    //this bit doesnt work - the 'also' isnt appearing


    dyno.fact.push(`This dynosaur is ${comparrison1} than you are by ${Math.abs(dyno.height - human.height)}"`)
    dyno.fact.push(`This dynosaur is ${comparrison2} than you are by ${Math.abs(dyno.weight - human.weight)}lbs`)
    dyno.fact.push(`This dynosaur's species name is ${comparrison3} than your name (by ${Math.abs(dyno.species.length - human.name.length)} characters)`)
    dyno.fact.push(`This dynosaur is a ${dyno.diet} and you are ${comparrison4} a ${human.diet}`)
    dyno.fact.push(`The ${dyno.species} lived ${ageLookup[dyno.when]}`)
    dyno.fact.push(`The ${dyno.species} has a ${comparrison5} BMI compared to you (${dynoBMI} vs. ${human.bmi})`)
}

let resetOption = document.getElementById('reset');
let form = document.getElementById('dino-compare');

const createGrid = function() {
    (function(human) {
        let nameValue = document.getElementById('name').value;
        let heightFeetValue = parseInt(document.getElementById('feet').value);
        let heightInchesValue = parseInt(document.getElementById('inches').value);
        let weightValue = parseInt(document.getElementById('weight').value);
        let dietValue = document.getElementById('diet').value.toLowerCase();

        human.name = nameValue
        human.weight = weightValue;
        human.height = heightFeetValue*12 + heightInchesValue;
        human.diet = dietValue;
        human.bmi = bmiCalculator(human.height,human.weight)
                
        form.classList.add('hidden')
        resetOption.classList.remove('hidden')

        // Generate Tiles for each Dino in Array
        mainGrid = document.getElementById('grid')
        for (var i = 0; i < 8; i++) {
        // use a 'gridIndex', to allow human to be placed in the middle of the dynosaur grid
            let gridIndex = i
            if (i >= 4) {
                gridIndex = i+1
            }
        // Creates the human tile
            if (i==4) {
                let newDiv = document.createElement('div');
                newDiv.classList.add('grid-item')
                newDiv.setAttribute('id',`grid-item:nth-child(4)`)
                newDiv.innerHTML = `
                    <h3>${human.name}</h3>
                    <img src="${human.image}" alt='human image'>
                    <p>
                    <span class="hidden" data-id=${i}>Height: ${Math.floor(human.height/12)}'${human.height%12}"<br/>Weight: ${human.weight}lb</span>
                </p>`

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

            dynoCompare(dinoArray[i],human)
            let newDiv = document.createElement('div');
            newDiv.classList.add('grid-item')
            newDiv.setAttribute('id',`grid-item:nth-child(${gridIndex})`)
            newDiv.innerHTML = `
                <h3>${dinoArray[i].species}</h3>
                <img src="images/${dinoArray[i].species}.png" alt=${dinoArray[i].species}>
                <p data-id=${i}>${randomItem(dinoArray[i].species,dinoArray[i].fact)} 
                <span class="hidden" data-id=${i}><br/><br/>From: ${dinoArray[i].where}<br/>Height: ${Math.floor(dinoArray[i].height/12)}'${dinoArray[i].height%12}"<br/>Weight: ${dinoArray[i].weight}lb</span>
                </p>`
   
            newDiv.addEventListener ('click', () => {
                factParagraph = document.getElementById(`grid-item:nth-child(${gridIndex})`).getElementsByTagName('p')[0]
                let i = factParagraph.getAttribute('data-id')
                factParagraph.innerHTML = `${randomItem(dinoArray[i].species,dinoArray[i].fact,factParagraph.innerText)} <span data-id=${i}><br/><br/>From: ${dinoArray[i].where}<br/>Height: ${Math.floor(dinoArray[i].height/12)}'${dinoArray[i].height%12}"<br/>Weight: ${dinoArray[i].weight}lb</span>`
            });
            
            newDiv.addEventListener ('mouseenter', () => {
                extraInfo = document.getElementById(`grid-item:nth-child(${gridIndex})`).getElementsByTagName('span')[0]
                extraInfo.classList.remove("hidden")
            });

            newDiv.addEventListener ('mouseleave', () => {
                extraInfo = document.getElementById(`grid-item:nth-child(${gridIndex})`).getElementsByTagName('span')[0]
                extraInfo.classList.add("hidden")
            });

        mainGrid.appendChild(newDiv);
        }
    })(human);
}; 

function validateForm () {
    let nameValue = document.getElementById('name').value;
    let heightFeetValue = parseInt(document.getElementById('feet').value);
    let heightInchesValue = parseInt(document.getElementById('inches').value);
    let weightValue = parseInt(document.getElementById('weight').value);

    let message = ''
    let proceed = true

    if (nameValue == '') {
        message += 'Please enter your name\n'
        proceed = false
    }

    if (heightFeetValue <0 || isNaN(heightFeetValue) || heightInchesValue <0 || isNaN(heightInchesValue)) {
        message += 'Please enter a valid height\n'
        proceed = false
    }

    if (isNaN(weightValue)) {
        message += 'Please enter a valid weight\n'
        proceed = false
    }

    if (proceed) {
        createGrid()
    } else {
        alert(message)
    }
}

submitButton.addEventListener('click', validateForm);

//reset the data and show the input form again
resetOption.addEventListener('click', () => {
    form.classList.remove('hidden')
    resetOption.classList.add('hidden')
    document.getElementById('name').value = '';
    document.getElementById('feet').value = '';
    document.getElementById('inches').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('diet').value = 'Herbavor';
    document.getElementById('grid').innerHTML=''
})

function bmiCalculator(height,weight) {
    let heightMeters = height*0.0254
    let weightKilograms = weight*0.453592
    return parseInt((weightKilograms/(heightMeters*heightMeters)).toFixed(1))
}