import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  zoom = 12;
  // Initialize center to Aachen
  center: google.maps.LatLngLiteral = {
    lat: 50.7753,
    lng: 6.0839,
  };
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    // maxZoom: 15,
    minZoom: 2,
  };
  manuscripts:any  = [];

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getManuscripts();
    this.center = {
      lat: 50.7753,
      lng: 6.0839,
    }
  }

  // on click of element in list -> set center/ markings on map
  // TODO: get center info from api call to database with name of manuscript selected
  onSelect(): void {
    this.center = {
      lat: 49.2827,
      lng: -123.1207,
    };
  }

  // get list of manuscripts from the backend
  getManuscripts(): void {
    let res = this.http.get('http://localhost:8000/api/manuscripts');
    res.subscribe((data) => {
      this.manuscripts = data;
    });
  }

}
