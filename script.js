const BACKEND_URL = 'https://ticket-hack-backend-three.vercel.app/';
const resultsSection = document.querySelector('.results-section');
const searchForm = document.querySelector("#search-form");

async function getTripByParams(departure, arrival, date) {
  resultsSection.innerHTML = ""; //remise a zéro des recherches précédentes 
  try {
    const response = await fetch(`${BACKEND_URL}trips?departure=${departure}&arrival=${arrival}&date=${date}`);
    const trips = await response.json();

    if(trips.result) {
      for(const trip of trips.trips) {
        const date = trip.date;
        const formattedDate = moment(date).format("DD-MM-YYYY");
        const formattedTime = moment(date).format("HH:mm");

        resultsSection.innerHTML += `
          <div class="d-flex justify-content-between trajet-result shadow-sm">
            <p><span class="fw-bold">Départ</span> : ${trip.departure}</p>
            <p><span class="fw-bold">Arrivée</span> : ${trip.arrival}</p>
            <p><span class="fw-bold">Date</span> : ${formattedDate}</p>
            <p><span class="fw-bold">Heure de départ</span> : ${formattedTime}</p>
            <button class="book btn btn-danger" id="${trip._id}">Ajouter au panier</button>
          </div>
        `;

        const bookButtons = document.querySelectorAll('.book');

        bookButtons.forEach(button => {
          button.addEventListener('click', async (e) => {
            const tripId = button.id;
            try {
              const res = await fetch(`${BACKEND_URL}book/${tripId}`, {
                method: 'POST',
              });
              const data = await res.json();

              if (data.result) {
                getTripByParams(departure, arrival, date);
              } else {
                alert(data.message || 'Problème lors de l’ajout au panier');
              }
            } catch (err) {
              console.error(err);
              alert("Une erreur est survenue lors de l’ajout au panier.");
            }
        });
      });
    }

    } else {
      resultsSection.innerHTML = `
        <img class="d-flex justify-content-center w-25" src="./images/notfound.png"> 
        <p class="text-center fw-bold mt-4">Aucun trajet ne correspond à votre recherche.</p>
      `;
    }
  } catch(error) {
    console.error("Erreur lors de la recherche :", error);
  }
}

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  
  const departure = document.querySelector("#departure").value.trim();
  const arrival = document.querySelector("#arrival").value.trim();
  const date = document.querySelector("#date").value; 

  if (!departure || !arrival || !date) {
    alert("Merci de remplir tous les champs (Départ, Arrivée, Date).");
    return;
  }

  getTripByParams(departure, arrival, date);
});


  
  