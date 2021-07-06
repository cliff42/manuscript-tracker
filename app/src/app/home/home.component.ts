import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Manuscript {
  name: string;
  author: string;
  locations: any;
  dates: any;
}

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
  markers: any[] = [
    {
      title: 'Test Marker1',
      position: {
        lat: 50.7783,
        lng: 6.0839,
      },
      label: 'Test Label',
      clickable: true,
      // options: { animation: google.maps.Animation.BOUNCE },
    }
  ];
  dataSource: any;

  displayedColumns: string[] = ['name'];

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
  onSelect(manuscript: Manuscript): void {
    if (manuscript.name === 'Manuscript 1') {
      this.center = {
        lat: 49.2827,
        lng: -123.1207,
      };
    } else {
      this.ngOnInit();
    }
  }

  // get list of manuscripts from the backend
  getManuscripts(): void {
    let res = this.http.get('http://localhost:8000/api/manuscripts');
    res.subscribe((data) => {
      // TODO: maybe need to use 'renderRows()' method on table to update with manuscripts after get is called
      this.dataSource = data;
    });
  }

}
