"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const movements = (movements) => {
  containerMovements.innerHTML = "";
  movements.forEach((a, i) => {
    const type = a > 0 ? "deposit" : "withdrawal";

    const html = `
           <div class="movements__row">
             <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
             <div class="movements__value">${a}€</div>
           </div>;`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
//This is shit

// movements(account1.movements);
// const bala = function(a){
//   a.forEach(function(a){
//     a.balance = a.movements.reduce(function(a,b){
//       return a + b;
//     },0);
//   })
// }
// bala(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// calcDisplayBalance(account1.movements);
//displaying summary
const calcDisplaySummary = (a) => {
  const income = a.movements
    .filter((a) => a > 0)
    .reduce((a, val) => a + val, 0);
  labelSumIn.textContent = `${income}€`;

  const out = a.movements
    .filter((a) => a < 0)
    .reduce((def, val) => def + val, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = a.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (a) {
      return (a * 1.2) / 100;
    })
    .filter(function (a, i) {
      return a >= i;
    })
    .reduce(function (k, val) {
      return k + val;
    }, 0);

  labelSumInterest.textContent = `${interest}EUR`;
};
// calcDisplaySummary(account1.movements);

const createUserNames = (acc) => {
  acc.forEach(function (a) {
    a.username = a.owner
      .toLowerCase()
      .split(" ")
      .map((a) => a[0])
      .join("");
  });
};
createUserNames(accounts);
const updateUI = function (acc) {
  movements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

let currentUser;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentUser = accounts.find(function (a) {
    return a.username === inputLoginUsername.value;
  });
  console.log(currentUser);

  if (currentUser?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `welcome back ${
      currentUser.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    // movements(currentUser.movements);
    // calcDisplayBalance(currentUser);
    // calcDisplaySummary(currentUser);
    updateUI(currentUser);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentUser.balance >= amount &&
    receiverAcc?.username !== currentUser.username
  ) {
    currentUser.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentUser);
  } else {
    console.warn("ErrOR");
  }
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const index = accounts.findIndex(
      (a) => a.username === currentUser.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  } else {
    console.warn("ERROR");
  }
});


btnLoan.addEventListener("click",function(e){
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  inputLoanAmount.value ="";

    
  if( loanAmount > 0 && currentUser.movements.some(mov => mov >= loanAmount /10)){
        currentUser.movements.push(loanAmount);
        updateUI(currentUser);
  }else{
    console.warn("ERROR");
  }
   
})