/** Adds a restaurant object to the target element
*/
const restAdder = (restaurants, target) => {
  // Get restaurant data
  target.innerHTML = `
  <tr>
  <th>Name</th>
  <th>Address</th>
  </tr>
  `;
  
  restaurants.forEach(restaurant => {
  const name = restaurant.name;
  const address = restaurant.address;

  // Make HTML and add to table
  const tr = document.createElement('tr');
  const namefield = document.createElement('th');
  namefield.textContent = name;
  tr.appendChild(namefield);
  const addressfield = document.createElement('th');
  addressfield.textContent = address;
  tr.appendChild(addressfield);

    // user interactivity
    // clicking on a restaurant highlights it and opens a dialog window
    tr.addEventListener('click', () => {
      target.querySelectorAll('tr').forEach(tr => tr.classList.remove('highlight'));
      console.log(name);
      tr.classList.toggle('highlight');

      updatedialog();
      dialog.showModal();
    });

  target.appendChild(tr);
  });
}

/** Updates the content of the pop-up dialog window
*/
const updatedialog = () => {
  // Clear old data from the dialog
  // -> Fetch new data and format it into html code
  // -> Add the new data to the dialog
  const gridarea = document.querySelector('dialog');
  gridarea.innerHTML = '';
  const highlighted = document.querySelector('.highlight');
  const restaurant = restaurants.find(restaurant => restaurant.name === highlighted.querySelector('th').textContent);
  const menu = fetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${restaurant._id}/fi`)
    .then(response => response.json())
    .then(function(response){
      const menu = elementMaker('ul', "", 'gridmenu');
      response.courses.forEach(dish => {
        menu.appendChild(elementMaker('li', `${dish.name} ${dish.price} ${dish.diets}`, 'gridmenuitem'));
      })
      gridarea.appendChild(elementMaker('p', restaurant.name, 'gridname'));
      gridarea.appendChild(menu);
      gridarea.appendChild(elementMaker('p', restaurant.address, 'gridaddress'));
      gridarea.appendChild(elementMaker('p', restaurant.postalCode, 'gridpostalCode'));
      gridarea.appendChild(elementMaker('p', restaurant.city, 'gridcity'));
      gridarea.appendChild(elementMaker('p', restaurant.phone, 'gridphone'));
      gridarea.appendChild(elementMaker('p', restaurant.company, 'gridcompany'));
      const closebutton = elementMaker('button', 'Close', 'close');
      closebutton.addEventListener('click', () => gridarea.close());
      gridarea.appendChild(closebutton);
    });
};

/** Quick HTML element maker
*/
const elementMaker = (type, text = "", id) => {
  const element = document.createElement(type);
  element.textContent = text;
  element.id = id;
  return element;
};

// MAIN
// Restaurant data
const restaurants = [];
const restaurantArea = document.querySelector('table');
const dialog = document.querySelector('dialog');
const filterButtons = document.querySelectorAll('.filterbutton');

// Fetch restaurant data
// display to the site
(async function() {
  try {
    await fetch('https://10.120.32.94/restaurant/api/v1/restaurants')
    .then(response => response.json())
    .then(data => {
      data.forEach(restaurant => {
        restaurants.push(restaurant);
      });
      console.log('RESTAURANTS ADDED:');
      console.log(restaurants)
      restAdder(restaurants, restaurantArea),
      console.log('RESTAURANTS ADDED TO TABLE:')
    });

  } catch (error) {
    console.error('Error:', error);
    document.querySelector('body').innerHTML = `
    <h1>Something went wrong...</h1>
    <p>Could not fetch restaurant data 	&#128128 </p>
    <p>You are not connected to the Metropolia intranet</p>
    `;
  }
})();

// Set up filter buttons:
(async function() {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Add filtered restaurants to table:
      if (button.value === 'All') {
        restAdder(restaurants, restaurantArea);
      } else {
        const filtered = restaurants.filter(restaurant => restaurant.company.toLowerCase().includes(button.value.toLowerCase()));
        restAdder(filtered, restaurantArea);
      }
    });
  });
})();