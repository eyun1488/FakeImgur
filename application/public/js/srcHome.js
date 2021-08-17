// function addCode(title, img, id) {
//     document.getElementById("cardContainer").insertAdjacentHTML("beforeend",
//         `
//         <div id="photo-${id}" class="item" onclick="fadeOut('photo-${id}')">
//             <img class="images" src="${img}.jpeg" alt="${title}" id="${id}">
//             <p>Author: BaconMan</p>
//             <p>Note: </p>
//             <p class="imagedescription">${title}</p>
//         </div>
//     `
//     );
// }
// function displayCount(size) {
//     document.getElementById("count").innerHTML = `<p id="NumOfCards">Number of cards: ${size}</p>`;
// }
// async function load() {
//     try {
//         // var count = 0;
//         var res = await axios.get('https://jsonplaceholder.typicode.com/albums/2/photos');
//         size = res.data.length;
//         displayCount(size);
//         res.data.forEach(el => {
//             addCode(el.title, el.thumbnailUrl, el.id);
//             // count++;
//         })
//         // var cardArr = document.getElementsByClassName('item');
//         // [...cardArr].forEach(e => {
//         //     e.addEventListener('click', fadeOut(e));
//         // })

//     } catch (err) {
//         console.log("This is an ", err);
//     }
// }
// load();

// function fadeOut(id) {
//     var fadeTarget = document.getElementById(`${id}`);
//     var fadeEffect = setInterval(function () {
//         if (!fadeTarget.style.opacity) {
//             fadeTarget.style.opacity = 1;
//         }
//         if (fadeTarget.style.opacity > 0) {
//             fadeTarget.style.opacity -= 0.4999999;
//         } else {
//             clearInterval(fadeEffect);
//             remove(`${id}`);
//             displayCount(--size);
//         }
//     }, 200);
// }

// function remove(id) {
//     var removeDiv = document.getElementById(`${id}`);
//     removeDiv.parentNode.removeChild(removeDiv);
// }