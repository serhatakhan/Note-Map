// lokalden parametre olarak gelen elemanı alır
export const getStorage = () => {
  // lokalden key ile eşleşen veriyi alma
  const strData = localStorage.getItem("notes");

  // gelen string veriyi js verieine çevir ve döndür / çünkü lokalden gelen verilerin tamamnı string şeklinde geliyor
  return JSON.parse(strData);
};

// BURADA KULLANILAN NOTES, main.js DEKİ NOTES DEĞİL !!!
// LOCALSTORAGE'YE KAYDEDECEĞİMİZ VERİNİN İSMİ BU NOTES !!!

// lokale, parametre olarak gelen elemanı kaydeder/lokali güncelliyoruz.
export const setStorage = (data) => {
  // stringe çevir / çünkü lokalStorage verileri sadece string olarak tutuyor.!
  const strData = JSON.stringify(data);

  // lokale kaydet
  localStorage.setItem("notes", strData);
  // notes'i güncelleyeceğimizi söylüyoruz ve yeni verisi strData olacak.
};

// kütüphanenin ikon oluşturmamıza yarayan fonksiyonunu düzenledik.
// İKONLAR
export var userIcon = L.icon({
  iconUrl: "/images/Person.png",
  iconSize: [50, 50],
  popupAnchor: [0, -20],
  shadowUrl: "/images/my-icon-shadow.png",
  shadowSize: [68, 95],
  shadowAnchor: [30, 34],
});

var homeIcon = L.icon({
  iconUrl: "/images/Home_8.png",
  iconSize: [70, 75],
  popupAnchor: [0, -20],
  shadowUrl: "/images/my-icon-shadow.png",
  shadowSize: [68, 95],
  shadowAnchor: [30, 34],
});

var jobIcon = L.icon({
  iconUrl: "/images/Briefcase_8.png",
  iconSize: [70, 75],
  popupAnchor: [0, -20],
  shadowUrl: "/images/my-icon-shadow.png",
  shadowSize: [68, 95],
  shadowAnchor: [30, 34],
});

var visitIcon = L.icon({
  iconUrl: "/images/Aeroplane_8.png",
  iconSize: [70, 75],
  popupAnchor: [0, -20],
  shadowUrl: "/images/my-icon-shadow.png",
  shadowSize: [68, 95],
  shadowAnchor: [30, 34],
});

var parkIcon = L.icon({
  iconUrl: "/images/Parking_8.png",
  iconSize: [70, 75],
  popupAnchor: [0, -20],
  shadowUrl: "/images/my-icon-shadow.png",
  shadowSize: [68, 95],
  shadowAnchor: [30, 34],
});


// bu ikonların her birini içeren bir obje oluşturduk burada
export const icons = {
  visit: visitIcon,
  home: homeIcon,
  job: jobIcon,
  park: parkIcon,
};
