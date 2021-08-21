/* eslint-disable */
const displayMap = (locationArray) => {
	mapboxgl.accessToken =
		'pk.eyJ1IjoicmFtYW5hdGgiLCJhIjoiY2tzMzh0cnZ6MHdhdzJ1cnk3bjRnYzhjYiJ9.ressfrKK52mTtuVJc2SdqA'
	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/ramanath/cks3a6q8x8ppv18nxow0i31cq',
		scrollZoom: false
		// center: [-118.243683, 34.052235],
		// zoom: 10,
		// interactive: false
	})

	const bound = new mapboxgl.LngLatBounds()

	locationArray.forEach((loc) => {
		const el = document.createElement('div')
		el.className = 'marker'

		new mapboxgl.Marker({
			element: el,
			anchor: 'bottom'
		})
			.setLngLat(loc.coordinates)
			.addTo(map)

		new mapboxgl.Popup({
			offset: 30
		})
			.setLngLat(loc.coordinates)
			.setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
			.addTo(map)

		bound.extend(loc.coordinates)
	})

	map.fitBounds(bound, {
		padding: {
			top: 200,
			bottom: 150,
			left: 100,
			right: 100
		}
	})
}

export default displayMap
