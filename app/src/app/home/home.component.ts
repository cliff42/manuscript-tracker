import { Component, OnInit, Injectable, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Layout, Edge, Node } from '@swimlane/ngx-graph';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as shape from 'd3-shape';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class HomeComponent implements OnInit, AfterViewInit {
  map: any;
  zoom = 5;
  // Initialize center to Aachen
  center: google.maps.LatLngLiteral = {
    lat: 50.7753,
    lng: 6.0839,
  };
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    streetViewControl: false,
    // maxZoom: 15,
    minZoom: 2,
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#523735"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#c9b2a6"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#dcd2be"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ae9e90"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#93817c"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#a5b076"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#447530"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#fdfcf8"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f8c967"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#e9bc62"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e98d58"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#db8555"
          }
        ]
      },
      {
        "featureType": "road.local",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#806b63"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8f7d77"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#b9d3c2"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#92998d"
          }
        ]
      }
    ]
  };
  markers: any[] = [];
  polylines: any[] = [];
  dataSource: any;
  manuscripts: any = {};
  manuscript_info: string = "";
  manuscript_name: string = "";
  curr_id: number = 0;
  expandedManuscript: Manuscript | null = null;
  graphNodes: any[] = [];
  graphLinks: any[] = [];
  graphPanning: boolean = false;
  graphDragging: boolean = false;
  graphZoom: boolean = false;
  curve = shape.curveBundle.beta(1);
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();
  showGraph: boolean = false;

  @ViewChild('gmapElement', { static: false }) gmap!: ElementRef;

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

  ngAfterViewInit() {
    // this.map = new google.maps.Map(this.gmap.nativeElement, { center: this.center, zoom: this.zoom });
    this.map = this.gmap;
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
      this.populateInfo(this.manuscripts[marker.title]);
      this.centerMapOnNode(this.manuscripts[marker.title].locations);
      this.highlightStemmaNode(this.manuscripts[marker.title]._id);
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
    this.showGraph = false;

    // clear current graph
    this.graphNodes = [];
    this.graphLinks = [];

    let that = this;
    setTimeout(function () {
      that.updateGraph();
    }, 100);

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
        color: '#daf542',
      });
    }

    setTimeout(function () {
      that.updateGraph();
    }, 100);

    this.showGraph = true;
  }

  populateGraphHelper(parent: Manuscript, child: Manuscript): void {
    // add parent and child nodes to graphNodes
    // only add nodes if they don't already exist in the graph
    const check = this.graphNodes.find(n => n.id == parent._id);
    if (check == undefined) {
      this.graphNodes.push({
        id: parent._id,
        label: parent.name,
        color: '#daf542',
      });
    }
    // add child node
    this.graphNodes.push(
    {
      id: child._id,
      label: child.name,
      color: '#daf542',
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

  // when a node is clicked on the stemma graph
  onSelectStemmaNode(node: any): void {
    /* TODO: if can't click on individual ngx nodes, just use _id of selected node
    on map and then search trough list of nodes and change that one's colour - also
    will need to remove highlight on previously selected node - and will need to highlight
    autograph when it is first selected
    */
    // highlight selected nodes
    this.highlightStemmaNode(node.id);

    if (this.manuscripts[node.label] != null) {
      this.populateInfo(this.manuscripts[node.label]);
      this.centerMapOnNode(this.manuscripts[node.label].locations);
    }
  }

  highlightStemmaNode(id: any): void {
    for (let node of this.graphNodes) {
      if (node.id === id) {
        node.color = '#42f5c8';
      } else {
        node.color = '#daf542';
      }
    }
  }

  updateGraph(): void {
    this.update$.next(true)
    this.center$.next(true)
    this.zoomToFit$.next(true)
  }

  centerMapOnNode(locations: any): void {
    this.map.panTo({
      lat: locations[0],
      lng: locations[1],
    });
    // this.map.setZoom(this.zoom);
  }
}
