# 🧓💼 PensionSim Kenya: Retirement Planning for the Self-Employed

**PensionSim Kenya** is a personalized, simulation-based retirement planning tool designed specifically for gig workers, freelancers, small business owners, and informal sector workers—especially in underserved markets like Kenya. The platform enables users with irregular incomes to plan for retirement intelligently using actuarial models, scenario simulations, and personalized financial projections.

---

## 📌 Problem Statement

> Traditional pension tools assume stable monthly incomes and employer-based contributions.  
> In contrast, self-employed individuals often face:
- Irregular or seasonal earnings  
- Lack of formal pension structures (e.g., NSSF enrollment)  
- Limited financial planning literacy  
- No access to personalized pension advice  

---

## 💡 Solution

PensionSim Kenya bridges the pension accessibility gap by providing:
- 💰 **Flexible income modeling** (seasonal, monthly, or ad-hoc)  
- 📈 **Personalized contribution advice** based on life goals  
- 🔁 **Scenario simulations** (life expectancy, inflation, investment volatility)  
- 📊 **Visual dashboards** of projected corpus and savings gaps  
- 🧮 **Comparison tools** for NSSF, private pensions, or self-managed portfolios  

---

## 🔧 Features

- **Dynamic Income Tracking** – Accepts irregular user income data  
- **Contribution Recommendations** – Suggests how much to save monthly  
- **Monte Carlo Simulations** – Accounts for market volatility  
- **Life Expectancy Modeling** – Uses WHO or national life tables  
- **Inflation-Proof Projections** – Adjusts retirement corpus with CPI data  
- **Funding Gap Analysis** – Highlights how far a user is from their target  

---

## 📊 Data Inputs

| Input              | Description                           | Source              |
|-------------------|---------------------------------------|---------------------|
| Income            | Monthly/Seasonal/Annual income         | User or M-Pesa data |
| Expenses          | Optional                               | User input          |
| Retirement Age    | Target age                             | User input          |
| Life Expectancy   | Demographic estimate                   | WHO / KNBS          |
| Inflation Rate    | Historical + projected                 | CBK / KNBS          |
| Investment Returns| Simulated (low/med/high risk)          | Assumptions / Market data |

---

## 🔢 Core Actuarial Models

- 📉 Present Value of Annuities and Lump Sum Needs  
- 🎲 Monte Carlo Simulation (for returns & inflation)  
- 🧬 Life Expectancy Forecasting  
- 💸 Stochastic Contribution Flow Modeling  
- 📐 Funding Gap Estimation  

---

## 🖥️ Tech Stack

- **Frontend**: Streamlit or React (TBD)  
- **Backend**: Python (Pandas, NumPy, SciPy)  
- **Modeling**: Monte Carlo, actuarial functions  
- **Data**: WHO life tables, CBK inflation data, sample fund returns  
- **Deployment**: Streamlit Cloud / GitHub Pages / Heroku  

---

## 🚀 How to Use

```bash
# Clone the repo
git clone https://github.com/yourusername/SmartPension.git
cd SmartPension