document.addEventListener('DOMContentLoaded', () => {
    const ingredientList = document.getElementById('ingredient-list');
    const recipeList = document.getElementById('recipe-list');
    const recipeIngredientSelect = document.getElementById('recipe-ingredient');
    const resultDiv = document.getElementById('result');

    const ingredients = {};

    document.getElementById('add-ingredient').addEventListener('click', () => {
        const name = document.getElementById('ingredient-name').value;
        const cost = parseFloat(document.getElementById('ingredient-cost').value);
        const quantity = parseFloat(document.getElementById('ingredient-quantity').value);
        const unit = document.getElementById('ingredient-unit').value;

        if (name && !isNaN(cost) && !isNaN(quantity)) {
            ingredients[name] = { cost, quantity, unit };

            const listItem = document.createElement('li');
            listItem.textContent = `${name}: ${cost} per ${quantity} ${unit}`;
            listItem.dataset.name = name;
            ingredientList.appendChild(listItem);

            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            recipeIngredientSelect.appendChild(option);

            document.getElementById('ingredient-name').value = '';
            document.getElementById('ingredient-cost').value = '';
            document.getElementById('ingredient-quantity').value = '';
            document.getElementById('ingredient-unit').value = 'ml';
        }
    });

    document.getElementById('add-recipe').addEventListener('click', () => {
        const ingredient = recipeIngredientSelect.value;
        const quantity = parseFloat(document.getElementById('recipe-quantity').value);

        if (ingredient && !isNaN(quantity)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${ingredient}: ${quantity} ${ingredients[ingredient].unit}`;
            listItem.dataset.ingredient = ingredient;
            listItem.dataset.quantity = quantity;
            recipeList.appendChild(listItem);

            document.getElementById('recipe-quantity').value = '';
        }
    });

    document.getElementById('calculate-hpp').addEventListener('click', () => {
        const productName = document.getElementById('product-name').value;

        if (!productName) {
            alert('Masukkan nama produk terlebih dahulu.');
            return;
        }

        let totalHpp = 0;

        recipeList.querySelectorAll('li').forEach(item => {
            const ingredient = item.dataset.ingredient;
            const quantity = parseFloat(item.dataset.quantity);
            const ingredientData = ingredients[ingredient];

            const costPerUnit = ingredientData.cost / ingredientData.quantity;
            totalHpp += costPerUnit * quantity;
        });

        resultDiv.innerHTML = `<h2>${productName}</h2><p>HPP = ${totalHpp.toFixed(2)}</p>`;
    });

    document.getElementById('export-excel').addEventListener('click', () => {
        const productName = document.getElementById('product-name').value;
        if (!productName) {
            alert('Masukkan nama produk terlebih dahulu.');
            return;
        }

        const wb = XLSX.utils.book_new();
        wb.Props = {
            Title: "Perhitungan HPP",
            Subject: "HPP",
            Author: "Seribu Cangkir",
            CreatedDate: new Date()
        };

        const ws_data = [
            ["Nama Produk", productName],
            ["", ""],
            ["Bahan Baku", "Biaya per Satuan", "Jumlah Satuan"],
        ];

        for (const [name, data] of Object.entries(ingredients)) {
            ws_data.push([name, data.cost, `${data.quantity} ${data.unit}`]);
        }

        ws_data.push(["", ""]);
        ws_data.push(["Resep", "Jumlah"]);

        recipeList.querySelectorAll('li').forEach(item => {
            const ingredient = item.dataset.ingredient;
            const quantity = parseFloat(item.dataset.quantity);
            ws_data.push([ingredient, `${quantity} ${ingredients[ingredient].unit}`]);
        });

        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "HPP");

        XLSX.writeFile(wb, `${productName}_HPP.xlsx`);
    });
});
