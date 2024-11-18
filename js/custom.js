function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", function() {
  // Capture parameters from the URL
  const quotationID = getQueryParam("quotationID");
  const name = getQueryParam("name");
  const currency = getQueryParam("currency");
  const amount = getQueryParam("amount");

  // Populate the form fields with the query parameters if they exist
  if (quotationID) {
      document.getElementById("quotation-id").value = quotationID;
  }

  if (name) {
      document.getElementById("name").value = name;
  }

  if (currency) {
      document.getElementById("currency-select").value = currency;
      updateCurrencySymbol(); // Call function to update the currency symbol
  }

  if (amount) {
      document.getElementById("amount").value = amount;
  }
});

// Function to update the currency symbol
function updateCurrencySymbol() {
  const currencySelect = document.getElementById("currency-select");
  const selectedOption = currencySelect.options[currencySelect.selectedIndex];
  const symbol = selectedOption.getAttribute("data-symbol");
  document.getElementById("currency-icon").innerText = symbol;

  // Update the input field placeholder
  const placeholderText = `Enter amount in ${currencySelect.value}`;
  document.getElementById("amount").setAttribute("placeholder", placeholderText);
}


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const pickupLocation = document.getElementById("destination");
  const selectVehicle = document.getElementById("vehicle");
  const selectedLocationsContainer = document.getElementById("selected-locations");
  const selectedVehiclesContainer = document.getElementById("selected-vehicles");

  const modal = document.getElementById("thank-you-modal");
  const closeButton = modal.querySelector(".close-button");

  // Function to open the modal
  function openModal() {
    modal.style.display = "block";
  }

  // Function to close the modal
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside the content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Function to create a tag for selected destinations or vehicles
  function createTag(value, type) {
    const container = type === "location" ? selectedLocationsContainer : selectedVehiclesContainer;

    const tag = document.createElement("div");
    tag.classList.add("tag");

    const span = document.createElement("span");
    span.textContent = value;

    const button = document.createElement("button");
    button.innerHTML = "&times;";
    button.onclick = function () {
      tag.remove();
    };

    tag.appendChild(span);
    tag.appendChild(button);
    container.appendChild(tag);
  }

  // Event listener for adding selected destination
  pickupLocation.addEventListener("change", function () {
    Array.from(pickupLocation.selectedOptions).forEach(option => {
      createTag(option.value, "location");
    });
  });

  // Event listener for adding selected vehicle
  selectVehicle.addEventListener("change", function () {
    Array.from(selectVehicle.selectedOptions).forEach(option => {
      createTag(option.value, "vehicle");
    });
  });

  // Form submission handler
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Clear existing hidden inputs to prevent duplicates
    form.querySelectorAll("input[name='Destinations'], input[name='Vehicles']").forEach(input => input.remove());

    // Add hidden inputs for locations
    selectedLocationsContainer.querySelectorAll(".tag span").forEach(tag => {
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "Destinations";
      hiddenInput.value = tag.textContent;
      form.appendChild(hiddenInput);
    });

    // Add hidden inputs for vehicles
    selectedVehiclesContainer.querySelectorAll(".tag span").forEach(tag => {
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "Vehicles";
      hiddenInput.value = tag.textContent;
      form.appendChild(hiddenInput);
    });

    // Submit the form to Formspree via fetch API
    fetch("https://formspree.io/f/xldeldjb", { // Replace YOUR_FORM_ID with your actual Formspree ID
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          openModal(); // Show the thank-you modal
          form.reset();
          selectedLocationsContainer.innerHTML = "";
          selectedVehiclesContainer.innerHTML = "";
        } else {
          response.json().then((data) => {
            alert(data.errors ? data.errors.map(e => e.message).join(", ") : "Oops! There was a problem.");
          });
        }
      })
      .catch(() => {
        alert("Oops! There was a problem submitting your form.");
      });
  });
});




//telephone
document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.querySelector("#phone");

  const iti = window.intlTelInput(phoneInput, {
    separateDialCode: true,          // Separate the dial code from the phone number
    preferredCountries: ["us", "lk"], // Set preferred countries (add more as needed)
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js" // Utility script for extra functionality
  });

  // Optional: Get full number (with country code) on form submission
 
});

// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();



// owl carousel slider js
var owl = $('.portfolio_carousel').owlCarousel({
    loop: true,
    margin: 15,
    dots: false,
    center: true,
    autoplay: true,
    navText: [
        '<i class="fa fa-arrow-left" aria-hidden="true"></i>',
        '<i class="fa fa-arrow-right" aria-hidden="true"></i>'
    ],
    autoplayHoverPause: true,
    responsive: {
        0: {
            center: true,
            items: 1,      // Show only 1 item on small screens
            margin: 0
        },
        576: {
            center: true,
            items: 1      // Show only 1 item on medium screens as well
        },
        991: {
            center: true,
            items: 1      // Show only 1 item on large screens
        }
    }
})


// owl.owlcarousel2_filter

$('.owl-filter-bar').on('click', '.item', function (e) {
    var $items = $('.owl-filter-bar a')
    var $item = $(this);
    var filter = $item.data('owl-filter')
    $items.removeClass("active");
    $item.addClass("active");
    owl.owlcarousel2_filter(filter);

    e.preventDefault();
})


  var map = L.map('map').setView([7.8731, 80.7718], 7); // Sri Lanka coordinates
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);


// nice select
$(document).ready(function () {
    $('select').niceSelect();
});

let lastScrollPosition = 0;
const navbar = document.querySelector('.container-fluid');

window.addEventListener('scroll', () => {
  const currentScrollPosition = window.pageYOffset;

  if (currentScrollPosition > lastScrollPosition) {
    // Scrolling down, hide navbar
    navbar.style.top = '-70px'; // Adjust value based on your navbar height
  } else {
    // Scrolling up, show navbar
    navbar.style.top = '0';
  }

  lastScrollPosition = currentScrollPosition;
});


// Function to check if an element is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
  }
  
  // Function to add animation class to boxes when they are in the viewport
  function animateBoxes() {
    const boxes = document.querySelectorAll('.car_section .car_container .box');
    boxes.forEach(box => {
      if (isInViewport(box)) {
        box.classList.add('animate');
      }
    });
  }
  
  // Event listener for scroll and initial load
  window.addEventListener('scroll', animateBoxes);
  window.addEventListener('load', animateBoxes);
  




  // Handle form submission and redirect to payment gateway
document.getElementById('payment-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Get user input values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  // Validate the form (basic validation)
  if (!name || !email || !phone) {
    alert("Please fill in all the fields.");
    return;
  }

  // If everything is valid, redirect to payment gateway (use a placeholder link for now)
  alert("Redirecting to payment gateway...");
  
  // For now, just redirect to a payment gateway URL (this should be replaced with actual payment integration URL)
  window.location.href = "https://www.examplepaymentgateway.com/pay?name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email) + "&phone=" + encodeURIComponent(phone);
});










