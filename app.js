/**
 * Lógica principal de la aplicación Dog Explorer.
 * Gestiona el consumo de API, manipulación del DOM y persistencia en Web Storage.
 */

// 1. CONFIGURACIÓN Y REFERENCIAS AL DOM

const API_RANDOM_10_URL = 'https://dog.ceo/api/breeds/image/random/10';

// Elementos estáticos principales de la interfaz
const elements = {
    dogsContainer: document.getElementById('dogs-container'),
    statusMessage: document.getElementById('status-message'),
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('breed-input'),
    favoritesBtn: document.getElementById('favorites-btn')
};

// SVG del icono de "Favorito" inyectable dinámicamente
const HEART_ICON_SVG = `
    <svg class="icon-heart" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
`;


// 2. GESTIÓN DE ESTADO (LOCALSTORAGE API)

const FAVORITES_KEY = 'dogFavorites';

/**
 * Retorna el listado de favoritos almacenados localmente.
 * @returns {Array} Listado de objetos { url, breed, subBreed } almacenados.
 */
const getFavorites = () => {
    try {
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
        console.error("Error leyendo LocalStorage:", error);
        return [];
    }
};

/**
 * Añade un nuevo animal al listado de favoritos evitando duplicados.
 * @param {Object} dogData Objeto con propiedades url, breed y subBreed.
 */
const saveFavorite = (dogData) => {
    try {
        const favorites = getFavorites();
        const isAlreadyFavorite = favorites.some(fav => fav.url === dogData.url);
        
        if (!isAlreadyFavorite) {
            favorites.push(dogData);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        }
    } catch (error) {
        console.error("Error escribiendo en LocalStorage:", error);
    }
};

/**
 * Elimina una URL designada como favorita de la base local.
 * @param {string} imageUrl URL identificadora de la imagen a remover.
 */
const removeFavorite = (imageUrl) => {
    try {
        const favorites = getFavorites();
        const updatedFavorites = favorites.filter(fav => fav.url !== imageUrl);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
        console.error("Error eliminando del LocalStorage:", error);
    }
};


// 3. FUNCIONES DE UTILIDAD PARA DATOS Y UI

/**
 * Convierte el primer carácter de una cadena a mayúscula.
 */
const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Analiza la URL oficial proporcionada por Dog CEO API para extraer raza y subtipo.
 * @param {string} url La dirección remota original de resolución.
 * @returns {Object} Objeto estructurado { breed, subBreed } con la información separada.
 */
const extractBreedInfo = (url) => {
    try {
        // La información de parentesco siempre está contenida después de '/breeds/'
        const urlParts = url.split('/');
        const breedString = urlParts[4]; 
        const breedParts = breedString.split('-');
        
        const rawBreed = breedParts[0];
        const rawSubBreed = breedParts.length > 1 ? breedParts[1] : 'N/A';

        return {
            breed: capitalize(rawBreed),
            subBreed: rawSubBreed !== 'N/A' ? capitalize(rawSubBreed) : 'N/A'
        };
    } catch (error) {
        console.error("Error parseando la URL de la raza:", url, error);
        return { breed: 'Desconocido', subBreed: 'N/A' };
    }
};

/**
 * Controlador de visibilidad transaccional para el manejo de estados visuales.
 * @param {string} type Tipo del mensaje ('loading', 'error', 'info', o 'clear').
 * @param {string} message Texto descriptivo aplicable la lógica al flujo actual.
 */
const showStatus = (type, message = '') => {
    if (type === 'clear') {
        elements.statusMessage.innerHTML = '';
        elements.statusMessage.classList.add('d-none');
        return;
    }

    elements.statusMessage.classList.remove('d-none');
    
    // Inyección de estructura genérica combinada con CSS base
    elements.statusMessage.innerHTML = `
        <span class="status-message__text status-message__text--${type}">
            ${message}
        </span>
    `;
};


// 4. RENDERIZADO DEL DOM

/**
 * Mapeo y generación dinámica de tarjetas representativas de información contenida.
 * @param {string[]} dogUrls Subconjunto de URLs obtenidas tras una petición al servidor.
 */
const renderDogs = (dogUrls) => {
    // Depuración del contenedor de forma previa
    elements.dogsContainer.innerHTML = '';

    if (!dogUrls || dogUrls.length === 0) {
        showStatus('info', 'No se encontraron resultados.');
        return;
    }

    // Se instancia DocumentFragment para prevenir repaints excesivos del flujo de caja
    const fragment = document.createDocumentFragment();
    const currentFavorites = getFavorites();

    dogUrls.forEach((url) => {
        const { breed, subBreed } = extractBreedInfo(url);
        
        // Verificación de existencia del elemento actual en Web Storage
        const isFavorite = currentFavorites.some(fav => fav.url === url);
        const favoriteClass = isFavorite ? 'dog-card__favorite-btn fav-btn is-favorite' : 'dog-card__favorite-btn fav-btn';

        const card = document.createElement('article');
        card.className = 'dog-card'; 
        
        card.innerHTML = `
            <div class="dog-card__image-container">
                <img src="${url}" alt="Foto de perro raza ${breed}" class="dog-card__image" loading="lazy">
                
                <button type="button" class="${favoriteClass}" aria-label="${isFavorite ? 'Quitar de' : 'Añadir a'} favoritos" data-url="${url}" data-breed="${breed}" data-subbreed="${subBreed}">
                    ${HEART_ICON_SVG}
                </button>
            </div>
            
            <div class="dog-card__content">
                <h3 class="dog-card__title">${breed}</h3>
                <p class="dog-card__attribute">Sub-raza: <strong>${subBreed}</strong></p>
            </div>
        `;

        fragment.appendChild(card);
    });

    elements.dogsContainer.appendChild(fragment);
};


// 5. LÓGICA PRINCIPAL Y CONSUMO DE API

/**
 * Petición de carga inicial obteniendo 10 imágenes distribuidas aleatoriamente.
 */
const fetchRandomDogs = async () => {
    try {
        showStatus('loading', 'Cargando contenido...');
        
        const response = await fetch(API_RANDOM_10_URL);
        
        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

        const data = await response.json();

        // Control estructural obligatorio de la base de la respuesta provista por Dog CEO
        if (data.status !== 'success' || !Array.isArray(data.message)) {
            throw new Error('Formato de datos inesperado.');
        }

        showStatus('clear');
        renderDogs(data.message);

    } catch (error) {
        console.error("Error durante fetchRandomDogs:", error);
        showStatus('error', 'Ocurrió un problema de conexión. Por favor, intente recargar la página.');
    }
};

/**
 * Busca las imágenes de un tipo particular de raza.
 * @param {string} breedName Nombre formatado en minúsculas para aplicar en consulta URL.
 */
const searchBreed = async (breedName) => {
    try {
        showStatus('loading', `Buscando resultados para "${breedName}"...`);
        
        elements.dogsContainer.innerHTML = '';

        const response = await fetch(`https://dog.ceo/api/breed/${breedName}/images/random/10`);
        const data = await response.json();

        // Identificación semántica del error provisto por el servidor
        if (data.status === 'error' || !response.ok) {
            throw new Error('BREED_NOT_FOUND');
        }

        showStatus('clear');
        renderDogs(data.message);

    } catch (error) {
        console.error("Error durante searchBreed:", error);
        
        showStatus('clear'); 
        
        if (error.message === 'BREED_NOT_FOUND') {
            elements.dogsContainer.innerHTML = `
                <div class="status-message__text status-message__text--error" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-6); text-align: center; max-width: 600px; margin: 0 auto; gap: var(--space-3);">
                    <h2 style="font-size: var(--font-size-xl);">Resultados no encontrados</h2>
                    <p style="font-size: var(--font-size-base);">No existen resultados para la raza <strong>"${breedName}"</strong>.</p>
                    <p style="font-size: var(--font-size-sm); font-weight: 400;">Intente buscar un término diferente en minúsculas (ej. "hound", "boxer", "husky").</p>
                </div>
            `;
        } else {
            showStatus('error', 'Ocurrió un error de red al intentar buscar. Por favor, intente de nuevo.');
        }
    }
};

/**
 * Muestra directamente los perros guardados en favoritos extraídos del Web Storage.
 */
const showFavoriteDogs = () => {
    showStatus('loading', 'Cargando tu colección de favoritos...');
    
    const favoritesData = getFavorites();

    showStatus('clear');

    if (favoritesData.length === 0) {
        elements.dogsContainer.innerHTML = `
            <div class="status-message__text status-message__text--info" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-6); text-align: center; max-width: 600px; margin: 0 auto; gap: var(--space-3);">
                <h2 style="font-size: var(--font-size-xl);">Aún no tienes favoritos</h2>
                <p style="font-size: var(--font-size-base);">Haz clic en el icono de corazón de cualquier perro para guardarlo aquí.</p>
            </div>
        `;
        return;
    }

    const favoriteUrls = favoritesData.map(dog => dog.url);
    
    // Al reutilizar renderDogs, la función verificará automáticamente que son favoritos
    // y los pintará con el corazón rojo.
    renderDogs(favoriteUrls);
};

// 6. INICIALIZACIÓN DE LA APLICACIÓN Y EVENTOS

/**
 * Inicia el enrutamiento de captura de eventos por delegación global de contenedores.
 */
const initDelegatedEvents = () => {
    elements.dogsContainer.addEventListener('click', (event) => {
        const favButton = event.target.closest('.fav-btn');
        
        if (!favButton) return;

        const dogData = {
            url: favButton.dataset.url,
            breed: favButton.dataset.breed,
            subBreed: favButton.dataset.subbreed || 'N/A'
        };

        const isNowFavorite = favButton.classList.toggle('is-favorite');

        if (isNowFavorite) {
            saveFavorite(dogData);
            favButton.setAttribute('aria-label', `Quitar de favoritos`);
        } else {
            removeFavorite(dogData.url);
            favButton.setAttribute('aria-label', `Añadir a favoritos`);
        }
    });
};

/**
 * Registra preventivamente el intento de envío del formulario de consulta de datos del DOM.
 */
const initSearchEvents = () => {
    elements.searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        
        const rawInputValue = elements.searchInput.value;
        const cleanBreedName = rawInputValue.trim().toLowerCase();
        
        if (!cleanBreedName) {
            showStatus('error', 'Por favor, ingrese un término de búsqueda válido.');
            elements.searchInput.focus();
            return;
        }

        searchBreed(cleanBreedName);
    });

    // Evento exclusivo para el botón "Mis Favoritos" en la barra de navegación
    elements.favoritesBtn.addEventListener('click', () => {
        showFavoriteDogs();
    });
};

// Carga base y montado de controladores iniciales
document.addEventListener('DOMContentLoaded', () => {
    initSearchEvents();
    initDelegatedEvents(); 
    fetchRandomDogs();
});
