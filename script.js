
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("add-btn");
    const incomeInput = document.getElementById("Income");
    const categorySelect = document.getElementById("category-select");
    const amountInput = document.getElementById("amount-input");
    const dateInput = document.getElementById("date-input");
    const expenseTableBody = document.getElementById("expense-table-body");
    const totalAmountElement = document.getElementById("total-amount");
    const savingsAmountElement = document.getElementById("savings-amount");
    const expenseChartCtx = document.getElementById("expenseChart").getContext("2d");

    let totalExpenses = 0;
    let categoryTotals = {
        Food: 0,
        Transportation: 0,
        Rent: 0,
        Entertainment: 0,
        Others: 0
    };
    
    let expenseChart;

    function updateChart(totalIncome) {
        const savings = totalIncome - totalExpenses;

        const data = [
            categoryTotals.Food,
            categoryTotals.Transportation,
            categoryTotals.Rent,
            categoryTotals.Entertainment,
            categoryTotals.Others,
            savings
        ];

        const labels = ["Food", "Transportation", "Rent", "Entertainment", "Others", "Savings"];

        if (expenseChart) {
            expenseChart.destroy();  
        }

        // Create a new pie chart
        expenseChart = new Chart(expenseChartCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: "Expenses Breakdown",
                    data: data,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                        "rgba(255, 159, 64, 0.6)"
                    ],
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        color: '#fff',
                        formatter: (value, ctx) => {
                            let sum = 0;
                            const dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.forEach(data => sum += data);
                            const percentage = (value * 100 / sum).toFixed(2) + "%";
                            return percentage;
                        },
                        font: {
                            weight: 'bold',
                            size: 14,
                        }
                    }
                }
            },
            plugins: [ChartDataLabels] 
        });
    }

    function addExpense() {
        const category = categorySelect.value;
        const amount = parseFloat(amountInput.value);
        const date = dateInput.value;
        const totalIncome = parseFloat(incomeInput.value);

        if (isNaN(amount) || amount <= 0 || date === "" || isNaN(totalIncome) || totalIncome <= 0) {
            alert("Please enter valid details");
            return;
        }

        
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td>${category}</td>
            <td>${amount.toFixed(2)}</td>
            <td>${date}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;

        expenseTableBody.appendChild(newRow);

        
        categoryTotals[category] += amount;
        totalExpenses += amount;
        totalAmountElement.textContent = totalExpenses.toFixed(2);

        // Update savings and chart
        updateSavings(totalIncome);
        updateChart(totalIncome);

        amountInput.value = "";
        dateInput.value = "";

        newRow.querySelector(".delete-btn").addEventListener("click", () => {
            deleteExpense(newRow, amount, category, totalIncome);
        });
    }

    function deleteExpense(row, amount, category, totalIncome) {
        expenseTableBody.removeChild(row);

        categoryTotals[category] -= amount;
        totalExpenses -= amount;
        totalAmountElement.textContent = totalExpenses.toFixed(2);

        updateSavings(totalIncome);
        updateChart(totalIncome);
    }

    function updateSavings(totalIncome) {
        const savings = totalIncome - totalExpenses;
        savingsAmountElement.textContent = savings.toFixed(2);
    }

    addBtn.addEventListener("click", (event) => {
        event.preventDefault();
        addExpense();
    });
});
