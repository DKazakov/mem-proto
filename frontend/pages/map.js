import Link from 'next/link'
import Head from 'next/head'
import fetch from 'isomorphic-fetch'
import React, {Component} from 'react'
import ss from './map.sass'

let GoogleMap

class Point extends Component {
    constructor(props) {
        super(props)
    }
    handleClick() {
        alert('point ' + this.props.text + ' click')
    }
    render() {
        return (
            <div className={ss.point} onClick={this.handleClick.bind(this)}>
                <div className={ss.point__text}>{this.props.text}</div>
            </div>
        )
    }
}

class Map extends Component {
    constructor() {
        super()

        this.state = {
            map: false
        }
    }
    mapOptions() {
        return {
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            zoomControl: true,
            styles: [
                {
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#092a34'
                        }
                    ]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#000000'
                        }
                    ]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#104c5e'
                        }
                    ]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry.stroke',
                    stylers: [
                        {
                            color: '#104c5e)'
                        }
                    ]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#000000'
                        }
                    ]
                },
                {
                    featureType: "all",
                    elementType: "labels",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                }
            ], 
            "elementType": "geometry"
        }
    }
    componentDidMount() {
        GoogleMap = require('google-map-react').default

        this.setState({
            map: true
        })
    }
    static async getInitialProps({query}) {
        const {type} = query
        const rawStations = await fetch('http://www.wpsimple.local/json?q=items')
        const jsonStations = await rawStations.json()
        const stations = jsonStations.Items || []
        const stationsTotal = jsonStations.Length
        return {type, stations, stationsTotal}
    }
    getPoints() {
        let points = []
        if (this.props.type === "one") {
            points = [
                {
                    lat: 55.758914,
                    lng: 37.656261,
                    text: "one"
                },
                {
                    lat: 55.768914,
                    lng: 37.666261,
                    text: "more"
                }
            ]
        } else if (this.props.type === "two") {
            points = [
                {
                    lat: 55.758914,
                    lng: 37.656261,
                    text: "one"
                },
                {
                    lat: 55.748914,
                    lng: 37.646261,
                    text: "other"
                }
            ]
        } else if (this.props.type === "redis") {
            points = this.props.stations.map(e => {return {lat: e.Lat, lng: e.Lng, text: e.Text}})
        }

        return points.map(point => <Point {...point} />)
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel="stylesheet" href="/static/css/bundle.css" />
                </Head>
                <Link href="/"><a>&lt;= back</a></Link>
                <hr />
                <div className={ss.left}>

                    <Link href="?type=one"><a className={this.props.type === 'one' ? ss.link__active : ss.link}>get one</a></Link>
                    <br />
                    <Link href="?type=two"><a className={this.props.type === 'two' ? ss.link__active : ss.link}>get two</a></Link>
                    <br />
                    <Link href="?type=redis"><a className={this.props.type === 'redis' ? ss.link__active : ss.link}>get redis</a></Link>
                </div>
                <div className={ss.right}>
                    {this.state.map &&
                        <GoogleMap
                            bootstrapURLKeys={["AIzaSyC4PfF1IcaUGi9v_jlJ3TeeMss7adWLoLA"]}
                            center={[55.758914, 37.656261]}
                            zoom={13}
                            options={this.mapOptions()}>
                            {this.getPoints()}
                        </GoogleMap>
                    }
                </div>
            </div>
        )
    }
}

export default Map
