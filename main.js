// farklı dosyalardan gelen veriler
import { setStorage, getStorage, icons, userIcon } from "./helpers.js";

const form = document.querySelector("form");
const noteList = document.querySelector("ul");
const open = document.querySelector("#open")
const close = document.querySelector("#close")
const aside = document.querySelector("aside")

// console.log(aside)

//* global değişkenller (kodun her yerinden erişilebilen değişkenler)(const kullansaydık bir daha değiştiremezdik)
let coords;
let notes = getStorage() || []; //eğer boşsa null yerine boş dizi olsun
/* böylelikle ekrandan silinmiyor eklenen veriler. 
getstorage sayesinde verileri aldık. return yazmasaydık o veri, buraya aktarılmazdı. */
/* böyle yaparak sadece yeni bir eleman eklnediğinde çağırmış oluyoruz.
halbuki kullanıcı projeye girdiğinde de çağırmamız lazım. dolayısıyla 
loadmap() içinde de renderNoteList(notes) çağırmamız gerekiyor.!*/

let markerLayer = [];



// haritayı, kullanıcının konumuna göre ekrana basan fonk.
// çünkü en başta default olarak london'dan başlıyor.
function loadMap(coords) {
  //38.satırda gönderilen koordinatları, parametre olarak aldık. sonra hemen alttaki haritamıza ekledik
  var map = L.map("map").setView(coords, 14);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // imleleri tutacağımız ayrı bir katman oluşturma
  markerLayer = L.layerGroup().addTo(map);

  // kullanıcının konumuna imleç bas, ikinci parametreyi obje şeklinde göndermemiz gerek.
  L.marker(coords, { icon: userIcon }).addTo(map);

  // lokalden gelen verileri ekrana bas
  renderNoteList(notes);

  //haritadaki tıklanma olaylarını izle / harita kütüphanesi bu şekilde yap diyor
  map.on("click", onMapClick);
}

// NOT: callback nedir? bir fonk. içinden çağırdığımız diğer fonk.'lara denir.

/*mesela getCurrentPosition() fareyle üzerine geldiğimizde kullanıcının konumunu
başarılı şekilde alırsak bir fonk çalışacak.(buna succesCallback denmiş.).
eğer başarılı bir şekilde konumu alamazsak başka bir fonk çalışacak. 
(buna da errorCallback yazılmış) */

// kullanıcının konumunu alma
navigator.geolocation.getCurrentPosition(
  // konumu alırsa çalışacak fonk./ eğer konumu alırsak loadmap fonk çalışsın ve kullanıcının konumuna göre yüklesin haritayı
  (e) => {
    loadMap([e.coords.latitude, e.coords.longitude]); //köşeli parantez koyarak diziye çevirdik
  },
  //   konumu alamazsa çalışacak fonk./varsayılan olarakankaradan başlasın harita
  () => {
    loadMap([39.934497, 32.858248]);
  }
);

// haritadaki tıklanma olaylarında çalışır / harita kütüphanesi böyle yap diyor!!
// koordinatları bilmezsek simge gönderemeyiz. !!!
function onMapClick(event) {
  // tıklanan yeri konumuna eriştik ve global değişkene aktardık. eğer başına let yazsaydık bu artık başka bir değişken olacaktı.
  coords = [event.latlng.lat, event.latlng.lng];
  /*elimizde obje haindeyi. köşeli parantez koyarak bunu diziye çevirdik.
  harita kütüphanesinde genelde veri bu şekilde işleniyor. dizi içinde olması lazım.*/

  //   formu göster
  form.style.display = "flex";

  form[0].focus();
  /*formlar; içindeki elemanları, inputları vebutonları dizi şeklinde tutar. 
  dizideki ilk elemana odaklanmak istediğimz için form[0] yapacağız.*/
}
/***!! tıklanıldığı zaman bir olay gerçekleşiyor ve bu olayın bazı bilgileri var
tıkladığın nokta, kaç saniye tıkladın vs. vs. bu bilgilere erişmek için de 
eventi parametre olarak almak lazım.***/

// iptal butonuna tıklanırsa formu temizle ve kapat
form[3].addEventListener("click", () => {
  // formu kapat // reset() formlarda bulunan bir özellik. formu temizmenin kısa yolu
  form.reset();

  // formu kapat
  form.style.display = "none";
});

// form gönderilirse yeni bir not oluştur ve storage'e kaydet
form.addEventListener("submit", (e) => {
  // 1) sayfa yenilenmesini engelle
  e.preventDefault();

  // 2) inputlardaki verilerden bir not objesi oluştur
  const newNote = {
    id: new Date().getTime(), //benzersiz bir id oluşturmak için / getTime() ile milisaniye cinsinden alıyoruz.
    title: form[0].value,
    date: form[1].value,
    status:
      form[2]
        .value /*index.html de option'un value kısmına ne yazdıysak onu veriyor */,
    coords:
      coords /* bu sağa yazdıımız coords, globalde tanımladığımız ve daha sonra onMapClick fonksiyonunda değer atadığımız coord. */,
  };

  // 3) globalde tanımladığımız dizinin başına, unshift ile newnotu ekle
  notes.unshift(newNote);

  // 4) notları ekrana bas
  renderNoteList(notes);

  // 5) local storage'yi güncelle
  setStorage(notes);

  // 6) formu kapat, not yazdıktan sonra formu kapat
  form.style.display = "none";
  form.reset();
});

// ekrana notları basma
function renderNoteList(items) {
  //bu fonk. yukarıda çağırdık ve yukarda, parametresine notes'ları veridk.
  // önceden eklenen elemanları temizle / sebep: renderNoteList, her çağırdığımızda noteListesinin tamamını tekrar ekrana basıyor.
  /* bu da demek oluyor ki önceki notarı ekrandan silmemiz lazım.
  aksi takdirde eklenen elemendan daha fazla sayısıda not çıktısı görüyoruz ekranda.*/
  noteList.innerHTML = "";
  markerLayer.clearLayers();
  /* yukarıdaki durum imleçler için de geçerli. onları silmek için de
  kütüphanenin clearLayers metodunu kullandık. yoksa önceki imleçlerde üst üste geliyordu.*/

  // dizideki her bir obje için not kartı bas
  items.forEach((note) => {
    //içiçndeki notların her birini forEach kullanarak döndük ve her bir elemana note dedik !!
    // liste(li) elemanı oluştur
    const listEle = document.createElement("li");

    // data-id ekle, ilerde tıklayınca silebilelim diye bunu yaptık
    listEle.dataset.id = note.id;

    // içeriğini belirle // kapsayıcısı olan li'yi hemen yukarda oluşturduk zaten. içini yapıyoruz burada da.
    listEle.innerHTML = `
    <div class="info">
      <p>${note.title}</p>
      <p>
        <span>Tarih:</span>
        <span>${note.date}</span>
      </p>
      <p>
        <span>Durum:</span>
        <span>${note.status}</span>
      </p>
    </div>
    <div class="icons">
      <i id="fly" class="bi bi-airplane-engines-fill"></i>
      <i id="delete" class="bi bi-trash3-fill"></i>
    </div>
    `;

    // elemanı listeye ekle / bunun için de önce liste alanını çağırmamız gerekiyor. en yukarda ul'yi çağırıp noteLİst içine attık.
    noteList.appendChild(listEle);

    // elemanı haritaya ekle
    renderMarker(note);
  });
}

// not için, imleç katmanına yeni bir imleç ekler / kütüphanede böyle yapılıyor
function renderMarker(note) {
  // imleç oluştur
  L.marker(note.coords, { icon: icons[note.status] }) //ikonları dinamik hale getirdik
    // imleci katmana ekle
    .addTo(markerLayer)
    .bindPopup(note.title)
}

// silme ve uçuş
noteList.addEventListener("click", (e) => {
  // tıklanılan elemanın id'sine erişmek / closest(), herhangi bir elemana yakın olan farklı bir elemanı seçmeye yarar
  const found_id = e.target.closest("li").dataset.id; //id'sine erişmemiz lazım

  if (
    e.target.id === "delete" &&
    confirm("Silme İşlemini Onaylıyor Musunuz?")
  ) {
    // id'sini bildiğimiz elemanı diziden çıkart / filtreleyerek notes'i güncelliyoruz.
    notes = notes.filter((note) => note.id != found_id); //silineceklerin değil kalacakların koşulunu yazdık. hangileri kalacak onu yazdık. dedik ki, silinecek olmayan kalacak.
    // silinecek elemanın id'si eşit değilse kalacak.

    //  lokal eksik kalmasın, onu da güncelle
    setStorage(notes);

    // ardından ekranı güncelle
    renderNoteList(notes);
  }

  if (e.target.id === "fly") {
    // id'sini bildiğimiz elemanın dizideki haline erişme
    const note = notes.find((note) => note.id == found_id)

    // not'un koordinatlarına uçurma / kütüphanenin metodu
    map.flyTo(note.coords)
  }
});

// not ekranını aç
open.addEventListener("click", ()=>{
  aside.classList.remove("hide")
  open.classList.add("hide")
  close.classList.remove("hide")
})

// not ekranını kapat
close.addEventListener("click", ()=>{
  aside.classList.add("hide")
  close.classList.add("hide")
  open.classList.remove("hide")
})
