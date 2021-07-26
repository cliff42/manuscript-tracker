import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Manuscript {
  name: string;
  author: string;
  locations: any;
  earlyDate: any;
  lateDate: any;
  sources: any;
  children: any;
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
  manuscripts: Manuscript[] = [];

  displayedColumns: string[] = ['name'];

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getManuscripts();
    // get the manuscript autographs for the table
    this.getAutographs();
    this.center = {
      lat: 50.7753,
      lng: 6.0839,
    }
  }

  // on click of element in list -> set center/ markings on map
  onSelect(manuscript: Manuscript): void {
    // locations[0] = lat, locations[1] = lng
    this.center = {
      lat: manuscript.locations[0],
      lng: manuscript.locations[1],
    };
  }

  // get list of manuscripts from the backend
  getManuscripts(): void {
    let res = this.http.get<Manuscript[]>('http://localhost:8000/api/manuscripts');
    res.subscribe((data) => {
      data.forEach((e: any) => {
        this.manuscripts.push({
          name: e.name,
          author: e.author,
          locations: e.locations,
          earlyDate: e.earlyDate,
          lateDate: e.earlyTime,
          sources: e.sources,
          children: e.children,
        })
      });
    });
  }

  // get list of autographs to display in the table from the backend
  getAutographs(): void {
    let res = this.http.get('http://localhost:8000/api/autographs');
    res.subscribe((data) => {
      // TODO: maybe need to use 'renderRows()' method on table to update with manuscripts after get is called
      this.dataSource = data;
    });
  }
}
