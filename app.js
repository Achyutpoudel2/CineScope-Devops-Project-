
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const moodSelect = document.getElementById('moodSelect');
const result = document.getElementById('result');

const BASE = 'https://www.omdbapi.com/';

function showHint(msg){
  result.innerHTML = `<p class="hint">${msg}</p>`;
}

function renderMovie(data){
  if(!data || data.Response === "False"){
    showHint('Movie not found. Try a different name.');
    return;
  }
  const poster = (data.Poster && data.Poster !== 'N/A') ? data.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
  result.innerHTML = `
    <div class="card">
      <div class="poster"><img src="${poster}" alt="Poster"></div>
      <div class="details">
        <h2>${data.Title} <span style="font-size:16px;color:var(--muted)">(${data.Year})</span></h2>
        <div class="meta">
          <span class="badge">IMDB: ${data.imdbRating || 'N/A'}</span>
          <span class="badge">${data.Genre || 'N/A'}</span>
          <span class="badge">${data.Runtime || ''}</span>
        </div>
        <div class="plot">${data.Plot || ''}</div>
        <div class="row footer">
          <div>Director: ${data.Director || 'N/A'}</div>
          <div>Actors: ${data.Actors || 'N/A'}</div>
        </div>
      </div>
    </div>
  `;
}

async function fetchByTitle(title){
  showHint('Loading...');
  try{
    const url = `${BASE}?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    renderMovie(json);
  }catch(err){
    showHint('Network error. Check your internet connection.');
    console.error(err);
  }
}

async function searchByMood(mood){
  showHint('Searching for a movie matching mood: ' + mood + ' ...');
  try{
    const candidatesRes = await fetch(`${BASE}?s=${encodeURIComponent(mood)}&apikey=${OMDB_API_KEY}`);
    const candidates = await candidatesRes.json();
    if(!candidates.Search || candidates.Search.length === 0){
      showHint('No suggestions found for this mood.');
      return;
    }
    for(let i=0;i<Math.min(6,candidates.Search.length);i++){
      const title = candidates.Search[i].Title;
      const detailRes = await fetch(`${BASE}?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`);
      const detail = await detailRes.json();
      if(detail && detail.Genre && detail.Genre.includes(mood)){
        renderMovie(detail);
        return;
      }
    }
    const fallback = await fetch(`${BASE}?t=${encodeURIComponent(candidates.Search[0].Title)}&apikey=${OMDB_API_KEY}`);
    const fallbackJson = await fallback.json();
    renderMovie(fallbackJson);
  }catch(err){
    showHint('Network error while searching by mood.');
    console.error(err);
  }
}

searchBtn.addEventListener('click', ()=>{
  const q = searchInput.value.trim();
  const mood = moodSelect.value;
  if(q){
    fetchByTitle(q);
  }else if(mood){
    searchByMood(mood);
  }else{
    showHint('Please type a movie name or select a mood.');
  }
});
searchInput.addEventListener('keypress', (e)=>{
  if(e.key === 'Enter') searchBtn.click();
});
