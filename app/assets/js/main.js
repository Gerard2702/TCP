$(window).load(function() {
    $(".loader").fadeOut("slow")
});

var map
var devices = {}

function starMap(){
    map = new google.maps.Map(document.getElementById('map'),{
        center: {lat: 13.685855, lng: -89.214544},
        zoom: 13,
        styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
    });
}

const socket = io()

socket.on('initData', data => {
    if(!map){
        starMap()
    }
    var data = data[0]
    console.log(data.latitude)
    var device = checkDeviceExists(data)
    device.lastData = data
    var position = new google.maps.LatLng(data.latitude,data.longitude)
    //device.path.getPath().push(position);
    device.marker.setPosition(position)
})

socket.on('pings', data => {
  if(data === 'undefined'){
      console.log('PING SIN DATOS');
  }else{
      console.log(data)
      var device = checkDeviceExists(data)
      device.lastData = data
      var position = new google.maps.LatLng(data.latitude,data.longitude)
      //device.path.getPath().push(position);
      device.marker.setPosition(position)
  }
  
})

function checkDeviceExists(data){
  var uid = data.uid
  if(typeof devices[uid] == "undefined"){
      return addDevice(uid, new google.maps.LatLng(data.latitude,data.longitude))
  }
  console.log("Esto devuele cjeckDevice: "+devices[uid])
  return devices[uid]
}

function addDevice(uid, LatLng){
  var marker = new google.maps.Marker({
      position: LatLng,
      map: map,
      animation: google.maps.Animation.Drop,
      title: 'UID'+uid
  });

  marker.setMap(map);
  google.maps.event.addListener(marker,'click',function(){
      var deviceData = getDevice(this.uid).lastData;
      console.log(deviceData);
      displayData(deviceData);        
  })

  devices[uid] = {
      uid: uid,
      marker: marker,
      path: null
  }
  return devices[uid];
}

function getDevice(uid){
  return devices[uid] || null;
}