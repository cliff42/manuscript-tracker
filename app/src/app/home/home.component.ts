import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Manuscript {
  name: string;
  author: string;
  info: string;
  _id: any;
  locations: any[];
  earlyDate: any;
  lateDate: any;
  sources: any[];
  children: any[];
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
    streetViewControl: false,
    // maxZoom: 15,
    minZoom: 2,
  };
  markers: any[] = [];
  polylines: any[] = [];
  dataSource: any;
  manuscripts: any = {};
  manuscript_info: string = "";
  manuscript_name: string = "";
  curr_id: number = 0;
  graphNodes: any[] = [];
  graphLinks: any[] = [];

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
  onTableSelect(manuscript: Manuscript): void {
    // locations[0] = lat, locations[1] = lng
    this.center = {
      lat: manuscript.locations[0],
      lng: manuscript.locations[1],
    };
    this.placeMarkers(manuscript);
    this.placePolylines(manuscript);
    this.populateInfo(manuscript);
    this.populateGraph(manuscript);
  }

  // on click of a node on the map
  onNodeSelect(marker: any): void {
    if (this.manuscripts[marker.title] != null) {
      let manuscript = this.manuscripts[marker.title];
      this.populateInfo(manuscript);
    }
  }

  // get list of manuscripts from the backend
  getManuscripts(): void {
    let res = this.http.get<Manuscript[]>('http://localhost:8000/api/manuscripts');
    res.subscribe((data) => {
      data.forEach((e: any) => {
        let manuscript: Manuscript = {
          name: e.name,
          author: e.author,
          info: e.info,
          _id: e._id,
          locations: e.locations,
          earlyDate: e.earlyDate,
          lateDate: e.earlyTime,
          sources: e.sources,
          children: e.children,
        };
        this.manuscripts[e.name] = manuscript;
      });

      // // populate children with objects instead of ids from database
      // for (let manuscript in this.manuscripts) {
      //   for (let i = 0; i < this.manuscripts[manuscript].children.length; i++) {
      //     if (this.manuscripts[this.manuscripts[manuscript].children[i]] != null) {
      //       this.manuscripts[manuscript].children[i] =
      //       this.manuscripts[this.manuscripts[manuscript].children[i]];
      //     }
      //   }
      // }
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

  // places markers on the map with the location of the autograph and its children
  placeMarkers(manuscript: Manuscript): void {
    // clear map's current markers
    this.markers = [];
    // add marker for autograph
    this.markers.push({
      title: manuscript.name,
      position: {
        lat: manuscript.locations[0],
        lng: manuscript.locations[1],
      },
      label: {text: manuscript.name, color: "white"},
      clickable: true,
      icon: {
        // TODO: change path to BACKWARDS_CLOSED_ARRORW with scale 8
        path: google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: "red",
        fillOpacity: 1,
        strokeWeight: 0.4
    },
      // options: { animation: google.maps.Animation.BOUNCE },
    })

    // recursivly place markers for each child
    for (let child of manuscript.children) {
      this.placeMarkersForChild(child);
    }
  }

  // place marker for child manuscript
  placeMarkersForChild(child: string) {
    // add markers for children
    if (this.manuscripts[child] != null) {
      this.markers.push({
        title: this.manuscripts[child].name,
        position: {
          lat: this.manuscripts[child].locations[0],
          lng: this.manuscripts[child].locations[1],
        },
        label: {text: this.manuscripts[child].name, color: "white"},
        clickable: true,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "blue",
          fillOpacity: 1,
          strokeWeight: 0.4
        },
        // options: { animation: google.maps.Animation.BOUNCE },
      });

      // if the child has children, place the nodes for those
      for (let manuscript of this.manuscripts[child].children) {
        // TODO: add different colours for each generation of children (just add/ subtract to/from hex value?)
        this.placeMarkersForChild(manuscript);
      }
    }
  }

  // populate the info div with the info for the manuscript
  populateInfo(manuscript: Manuscript): void {
    this.manuscript_name = manuscript.name;
    this.manuscript_info = manuscript.info;
  }

  // place polylines between each parent-child relation
  placePolylines(parent: Manuscript): void {
    console.log(this.manuscripts);
    // clear polylines
    this.polylines = [];
    for (let child of parent.children) {
      if (this.manuscripts[child] != null) {
        this.placePolylinesHelper(parent, this.manuscripts[child]);
      }
    }
  }

  placePolylinesHelper(parent: Manuscript, child: Manuscript) {
    this.polylines.push({
      path: [
        {lat: parent.locations[0], lng: parent.locations[1]},
        {lat: child.locations[0], lng: child.locations[1]},
      ],
      options: {
        strokeColor: "white",
      }
    });
    for (let manuscript of child.children) {
      if (this.manuscripts[manuscript] != null) {
        this.placePolylinesHelper(child, this.manuscripts[manuscript]);
      }
    }
  }

  populateGraph(parent: Manuscript): void {
    // clear current graph
    this.graphNodes = [];
    this.graphLinks = [];

    if (parent.children.length > 0) {
      for (let child of parent.children) {
        if (this.manuscripts[child] != null) {
          this.populateGraphHelper(parent, this.manuscripts[child]);
        }
      }
    } else {
      // populate single node
      this.graphNodes.push({
        id: parent._id,
        label: parent.name,
      });
    }

  }

  populateGraphHelper(parent: Manuscript, child: Manuscript): void {
    // add parent and child nodes to graphNodes
    // only add nodes if they don't already exist in the graph
    const check = this.graphNodes.find(n => n.id == parent._id);
    if (check == undefined) {
      this.graphNodes.push({
        id: parent._id,
        label: parent.name,
      });
    }
    // add child node
    this.graphNodes.push(
    {
      id: child._id,
      label: child.name,
    });

    // add link between parent and child nodes
    this.graphLinks.push({
      id: 'l' + parent._id + '_' + child._id,
      source: parent._id,
      target: child._id,
    });

    // populate each child nodes children
    for (let manuscript of child.children) {
      if (this.manuscripts[manuscript] != null) {
        this.populateGraphHelper(child, this.manuscripts[manuscript]);
      }
    }
  }
}
