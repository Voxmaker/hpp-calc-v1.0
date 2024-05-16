let materials = [];
let recipe = [];

function addMaterial() {
    const name = document.getElementById('materialName').value;
    const cost = parseFloat(document.getElementById('materialCost').value);
    const quantity = parseFloat(document.getElementById('materialQuantity').value);
    const unit = document.getElementById('materialUnit').value;

    if (name && !isNaN(cost) && !isNaN(quantity)) {
        materials.push({ name, cost, quantity, unit });
        updateMaterialsList();
        updateRecipeMaterialOptions();
    }
}

function updateMaterialsList() {
    const materialsList = document.getElementById('materialsList');
    materialsList.innerHTML = '';
    materials.forEach((material, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${material.name}: ${material.cost} per ${material.quantity} ${material.unit}</span>
                        <button onclick="removeMaterial(${index})">Hapus</button>`;
        materialsList.appendChild(li);
    });
}

function removeMaterial(index) {
    materials.splice(index, 1);
    updateMaterialsList();
    updateRecipeMaterialOptions();
}

function updateRecipeMaterialOptions() {
    const recipeMaterial = document.getElementById('recipeMaterial');
    recipeMaterial.innerHTML = '';
    materials.forEach((material, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = material.name;
        recipeMaterial.appendChild(option);
    });
}

function addRecipe() {
    const materialIndex = document.getElementById('recipeMaterial').value;
    const quantity = parseFloat(document.getElementById('recipeQuantity').value);

    if (!isNaN(quantity)) {
        recipe.push({ materialIndex, quantity });
        updateRecipeList();
    }
}

function updateRecipeList() {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';
    recipe.forEach((item, index) => {
        const material = materials[item.materialIndex];
        const li = document.createElement('li');
        li.innerHTML = `<span>${material.name}: ${item.quantity} ${material.unit}</span>
                        <button onclick="removeRecipe(${index})">Hapus</button>`;
        recipeList.appendChild(li);
    });
}

function removeRecipe(index) {
    recipe.splice(index, 1);
    updateRecipeList();
}

function calculateHPP() {
    let hpp = 0;
    recipe.forEach(item => {
        const material = materials[item.materialIndex];
        hpp += (item.quantity / material.quantity) * material.cost;
    });

    const productName = document.getElementById('productName').value;
    const resultSection = document.getElementById('result');
    const hppResult = document.getElementById('hppResult');

    hppResult.textContent = `${productName} HPP = Rp ${hpp.toFixed(2)}`;
    resultSection.style.display = 'block';
}
