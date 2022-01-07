class pallet {
    constructor(title, colors) {
        this.title = title;
        this.colors = colors;
      }
}

function getPallets() {
    const pallets = JSON.parse(localStorage.getItem('pallets')) || [];
    return pallets;
}

function setPallets(newJSON) {
    localStorage.setItem('pallets', JSON.stringify(newJSON));
}

function addKey() { /// adds +1 to the variable last-key this key is used to number a users pallets -1 never apears in code to this value only the user itself could break it.

    if (!localStorage.getItem('last-key')) {
        localStorage.setItem('last-key', 1)
    } else {
        const lastkey = localStorage.getItem('last-key');
        localStorage.setItem('last-key', JSON.parse(lastkey) + 1);
    }

    return localStorage.getItem('last-key');

}

function addPallet(palletData) {
    

    const pallets = getPallets();


    palletData['id'] = addKey();
    pallets.push(palletData);
    
    const json = JSON.stringify(pallets);

    localStorage.setItem('pallets', json);

    const object = JSON.stringify(new pallet("Unnamed", []));

    localStorage.setItem('currentPallet', object);

    location.reload();
}

function getCurrentPallet() {

    const parse = JSON.parse(localStorage.getItem('currentPallet')) || [new pallet("unnamed", [])];

    return parse;
}

function updateCurrentPallet(newpalletData) {

    console.log(newpalletData);

    const string = JSON.stringify(newpalletData);

    localStorage.setItem('currentPallet', string);
}

function addColor(color) {
    const currentPallet = getCurrentPallet();
    currentPallet['colors'].push(color);

    const object = JSON.stringify(currentPallet);
    localStorage.setItem('currentPallet', object)

    loadCurrentPalette(); 
}

function resetCurrentPalletPage() {

    const colors = document.querySelectorAll(".collorBlob_big");

    colors.forEach( (color) => {
        color.remove();
    })
}

function loadCurrentPalette() {

    resetCurrentPalletPage();

    const target = document.querySelector(".colorpads-add-container");

    const json = JSON.parse(localStorage.getItem('currentPallet'));
    const colors = json['colors'];

    let i = 0

    colors.forEach( (color) => {
        const colorbubble = document.createElement("div");
        colorbubble.classList = "collorBlob_big";
        colorbubble.style.backgroundColor = color;
        colorbubble.setAttribute("color-id", i)
        target.appendChild(colorbubble);
        addColorSliderFunctions(colorbubble);
        i++;
    })
}

let targetId = 0; // this global value is used to let the function bellow know what id is

function findID(item) {
    return item.id === targetId;
}

function RGBToHex(r,g,b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
  }

function addPalletObject(palletData) {
    const target = document.querySelector(".colorpads-container");

    ///// create pallet card
    const outside = document.createElement("div");
    const body = document.createElement("div");
    const idtagg = document.createElement("p");
    const title = document.createElement("p");
    const colorPadDiv = document.createElement("div");
    const deleteButton = document.createElement("button");
    const copyButton = document.createElement("button");

    outside.classList = "color-pad-item";
    title.classList = "title";
    idtagg.classList = "pallet-id";
    colorPadDiv.classList = "pallet-colors";
    deleteButton.classList = "pallet-delete-button";
    copyButton.classList = "copyButton";
    copyButton.value = JSON.stringify(palletData);

    idtagg.textContent = palletData['id'];
    title.textContent = palletData['title'];
    deleteButton.textContent = "Delete";
    copyButton.textContent = "Copy Pallet";

    deleteButton.setAttribute("active", "false");

    outside.append(idtagg, body, deleteButton);
    title.append(copyButton);
    body.append(title, colorPadDiv);

    target.appendChild(outside);
    

    ////// make color bubbles
    const colors = palletData['colors'];

    const maxColors = 5;
    let colorCount = 0;

    colors.forEach( (color) => {
        if (colorCount < maxColors) {
            const colorbubble = document.createElement("div");
            colorbubble.classList = "colorBubble";
            colorbubble.style.backgroundColor = color;
            colorPadDiv.appendChild(colorbubble);
            colorbubble.style.backgroundColor = color;
        }
        colorCount++;
    })

    ///////// make color cards with extra info
    const showAllColorsButton = document.createElement("button");
    const allColorDiv = document.createElement("div");

    allColorDiv.classList = "colorCardDiv";
    showAllColorsButton.textContent = "Show more";

    target.appendChild(allColorDiv);
    colorPadDiv.appendChild(showAllColorsButton);

    showAllColorsButton.addEventListener('click', () => {
        if (allColorDiv.style.height < "0" || allColorDiv.style.height == "0px") {
            allColorDiv.style.height = "fit-content";
            allColorDiv.style.padding = "10px 5px";
        } else {
            allColorDiv.style.height = "0";
            allColorDiv.style.padding = "0 5px";
        }
    })

    colors.forEach( (color) => {
        const colorCard = document.createElement("div")
        const colorDiv = document.createElement("div")
        const rgbText = document.createElement("p")
        const hexText = document.createElement("p")

        colorCard.classList = "colorCard";
        colorDiv.classList = "colorDiv";
        rgbText.classList = "colorCardInfoText";
        hexText.classList = "colorCardInfoText";

        const colorParsed = color.substring(4, color.length-1)
        .replace(/ /g, '')
        .split(',');

        rgbText.textContent = "RGB: " + color;
        
        if (colorParsed[0]) {
            hexText.textContent = "Hex: " + rgbToHex(colorParsed[0],colorParsed[1],colorParsed[2]);
        } else {
            hexText.textContent = "Hex: No RGB code";
        }

        colorDiv.style.backgroundColor = color;

        colorCard.append(colorDiv, rgbText, hexText);
        allColorDiv.appendChild(colorCard);
    })


    ////////// delete button functionality
    deleteButton.addEventListener('click', () => {
        const palletDataArray = getPallets();
        targetId = palletData['id'];
        
        const removeIndex = palletDataArray.map(function(item) { return item.id; }).indexOf(targetId);
        
        palletDataArray.splice(removeIndex, 1);

        setPallets(palletDataArray);

        location.reload();
    })

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(copyButton.value);
        alert("The pallet has been copied. import at the add page > pallet settings.");
    })

}

if (document.querySelector(".colorpads-container")) {
    const pallets = JSON.parse(localStorage.getItem('pallets')) || [];

    pallets.forEach((palletData) => {
        addPalletObject(palletData);
    })
}

if (document.querySelector(".selectPageButton")) {
    const buttons = document.querySelectorAll(".selectPageButton")

    buttons.forEach((currentbutton) => {
        
        currentbutton.addEventListener("click", () =>{

            buttons.forEach((button) => {
        
                if (currentbutton !== button) {
                    button.setAttribute("enabled", false);
                } else {
                    button.setAttribute("enabled", true);
                }
        
            });


        });

    });
}

if (document.querySelector(".colorBubble")) {
    const colorBubbles = document.querySelectorAll(".colorBubble");

    colorBubbles.forEach( (colorbubble) => {
        if (colorbubble.getAttribute("color")) {
            colorbubble.style.backgroundColor = colorbubble.getAttribute("color");
        }
    })
}

if (document.querySelector(".selectPageButton")) {
    const selectPageButtons = document.querySelectorAll(".selectPageButton");

    let previousEnabledPage = document.querySelector("#" + selectPageButtons[0].getAttribute('page'));

    selectPageButtons.forEach( (button) => {
        button.addEventListener('click', () => {
            previousEnabledPage.style.display = "none";

            const page = document.querySelector("#" + button.getAttribute('page'));

            previousEnabledPage = page;
            previousEnabledPage.style.display = "block";
        })
    })
}

if (document.querySelector("button")) {
    const buttons = document.querySelectorAll("button");

    buttons.forEach( (button) => {
        button.addEventListener('click', () => {
            if (button.getAttribute('link')) {
                window.location = button.getAttribute('link');
            }
        })
    })
}

if (document.querySelector(".addColorButton")) {

    if (!localStorage.getItem('currentPallet')) {
        const object = JSON.stringify(new pallet("Unnamed", []));
        localStorage.setItem('currentPallet', object)
        loadCurrentPalette(); 
    } else {
        loadCurrentPalette(); 
    }

    const button = document.querySelector(".addColorButton");

    button.addEventListener('click', () => {
        addColor("white");
    })
}

if (document.querySelector(".confirmPalletButton")) {
    const button = document.querySelector(".confirmPalletButton");

    button.addEventListener('click', () => {
        addPallet(getCurrentPallet());
    })
}

if (document.querySelector(".applypalletname")) {
    const button = document.querySelector(".applypalletname");

    button.addEventListener('click', () => {
        const currentPallet = getCurrentPallet();
        currentPallet['title'] = document.querySelector(".inputPalletName").value;
        updateCurrentPallet(currentPallet);
    })
}

function addColorSliderFunctions(Activator) {
    Activator.addEventListener('click', ()=>{
        currentColorTarget = Activator;
    });
}

let currentColorString = null;
let currentColorTarget = null;
let currentColor = [0, 0, 0];

if (document.querySelector(".colorpick-container")) {
    const colorpicker = document.querySelector(".colorpick-container");

    document.querySelector(".applyColor").addEventListener('click', ()=> {
        const colorId = JSON.parse(currentColorTarget.getAttribute("color-id"));
        const pallet = getCurrentPallet();
        pallet['colors'][colorId] = currentColorString;
        currentColorTarget.style.backgroundColor = currentColorString;
        currentColorTarget.style.borderColor = "var(--white)";
        currentColorTarget = null;
        updateCurrentPallet(pallet);
    })
    
}

function updateCurrentColorShowcases() {
    currentColorTarget.style.borderColor = currentColorString;
    document.querySelector(".colorShowcase").style.backgroundColor = currentColorString;
}

if (document.querySelector(".range-value")) {
    const ranges = document.querySelectorAll(".range-value");

    ranges.forEach( (rangeValue) => {
        if (rangeValue.getAttribute("range-id")) {
            const rangeId = rangeValue.getAttribute("range-id");
            const range = document.querySelector("#" + rangeId);
            
            rangeValue.textContent = range.value;

            range.addEventListener("input", ()=> {
                rangeValue.textContent = range.value;

                if (rangeId == "c1") {
                    currentColor[0] = range.value;
                } else if (rangeId == "c2") {
                    currentColor[1] = range.value;
                } else if (rangeId == "c3") {
                    currentColor[2] = range.value;
                }

                if (rangeId == "c1" || rangeId == "c2" || rangeId == "c3") { /// if this slider is to change a color then do this.
                    currentColorString = "rgb(" + currentColor[0] + "," + currentColor[1] + "," + currentColor[2] + ")";
                    updateCurrentColorShowcases()
                }

            })
        }
    })
}

if (document.querySelector(".importForm")) {
    const importButton = document.querySelector(".submitpallet");

    importButton.addEventListener("click", () => {

        const importText = document.querySelector(".palletCode").value;

        let json = importText;

        try {
            json = JSON.parse(json);

            if (new pallet(json)) {
                addPallet(json);
                alert("Pallet imported successfully")
            } else {
                alert("This pallet code is corrupted. Please copy again.")
            }
        } catch {
            console.error("The inserted text is not safe for the pallet structure there for transfer has been canceled.")
            alert("The inserted text is not safe for the pallet structure there for transfer has been canceled")
        }
    })
}

if (document.querySelector(".activateDeleteButton")) {

    let deleteMode = false;

    document.querySelector(".activateDeleteButton").addEventListener("click", () => {
        deleteMode = !deleteMode;
        
        const deleteButtons = document.querySelectorAll(".pallet-delete-button");

        deleteButtons.forEach((button) => {
            button.setAttribute("active", deleteMode);
        })

    });
    
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

function getColorVariation(color, up, down) {
    const upValues = [];
    const downValues = [];

    const colorParsed = color.substring(4, color.length-1)
        .replace(/ /g, '')
        .split(',');

    let currentColor = colorParsed; /// this variable can never be global there is already a global variable with this name

    for (let i = 1; i < up; i++) {
        const r = +currentColor[0]+(1*i);
        const g = +currentColor[1]+(1*i);
        const b = +currentColor[2]+(1*i);
        const color = [`rgb(${r},${g},${b})`, rgbToHex(r, g, b)];
        upValues.push(color);
    }

    for (let i = 1; i < down; i++) {
        const r = currentColor[0]*(i/down);
        const g = currentColor[1]*(i/down);
        const b = currentColor[2]*(i/down);
        const color = [`rgb(${r},${g},${b})`, rgbToHex(r, g, b)];
        downValues.push(color);
    }

    return {up: upValues, down: downValues}
}

function ShowColorVariations(baseColorRGB) {

    const colors = getColorVariation(baseColorRGB, 50, 50);

    const color_select_popup = document.createElement("div");
    const color_div = document.createElement("div");

    color_select_popup.classList = "color-select-popup";
    color_div.classList = "color-div";

    document.body.appendChild(color_select_popup);
    color_select_popup.appendChild(color_div);


    colors['down'].forEach( (color) => {
        const colorSquare = document.createElement("div");
        const p = document.createElement("p");

        colorSquare.classList = "colorSquare";

        colorSquare.style.backgroundColor = color[0];

        p.textContent = color[1];

        color_div.appendChild(colorSquare);
        colorSquare.appendChild(p);
    })

    colors['up'].forEach( (color) => {
        const colorSquare = document.createElement("div");
        const p = document.createElement("p");

        colorSquare.classList = "colorSquare";

        colorSquare.style.backgroundColor = color[0];

        p.textContent = color[1];

        color_div.appendChild(colorSquare);
        colorSquare.appendChild(p);
    })

}

if (document.querySelector(".colorpads-container")) {
    const colorCards = document.querySelectorAll(".colorDiv");

    colorCards.forEach( (colorCard) => {
        colorCard.addEventListener('click', () => {
            ShowColorVariations(colorCard.style.backgroundColor);
        })
    })
}