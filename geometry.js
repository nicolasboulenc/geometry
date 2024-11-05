'use strict';


// https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function describeArc(x, y, radius, startAngle, endAngle){

	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
		let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0
		return { x: centerX + (radius * Math.cos(angleInRadians)), y: centerY + (radius * Math.sin(angleInRadians)) }
	}

	let start = polarToCartesian(x, y, radius, endAngle)
	let end = polarToCartesian(x, y, radius, startAngle)

	let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

	let d = [
		"M", start.x, start.y, 
		"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ")

	return d
}


class SVGRenderer {

	constructor(svg) {
		this.svg = svg
	}

	render(shapes) {

		for(const shape of shapes) {

			let elem = null
			if(shape instanceof Circle) {
				elem = this.render_circle(shape)
			}
			else if(shape instanceof Line) {
				elem = this.render_line(shape)
			}
			this.svg.appendChild(elem)
		}
	}

	clear() {
		while (this.svg.firstChild !== null) {
			this.svg.removeChild(this.svg.firstChild)
		}
	}

	render_point(point) {

	}

	render_circle(circle) {

		// const elem = document.createElementNS(NS, "circle")
		// elem.setAttributeNS(null, "cx", circle.center.x)
		// elem.setAttributeNS(null, "cy", circle.center.y)
		// elem.setAttributeNS(null, "r", circle.radius)
		const elem = document.createElementNS(NS, "path")
		const d = describeArc(circle.center.x, circle.center.y, circle.radius, 0, 359.999)
		elem.setAttributeNS(null, "d", d)
		elem.setAttributeNS(null, "fill", "none")
		elem.setAttributeNS(null, "stroke", "darkblue")
		elem.setAttributeNS(null, "stroke-width", "0.5")
		return elem
	}

	render_line(line) {

		const elem = document.createElementNS(NS, "line")
		elem.setAttributeNS(null, "x1", line.pt1.x)
		elem.setAttributeNS(null, "y1", line.pt1.y)
		elem.setAttributeNS(null, "x2", line.pt2.x)
		elem.setAttributeNS(null, "y2", line.pt2.y)
		return elem
	}
}


class Geometry {

	shapes

	constructor() {
		this.shapes = []
	}

	createCircle(center, radius, start=0, end=359.999) {
		const c = new Circle(center, radius, start, end)
		this.shapes.push(c)
		return c
	}
}


class Point {

	constructor(x, y) {
		this.x = x
		this.y = y
	}
}


class Intersection {

	// do I need a number in shapes have more than 1 intersection
	constructor(shape1, shape2, num) {

		this.shape1 = shape1
		this.shape2 = shape2
		this.num = num
		this.x = 0
		this.y = 0
	}

	recalc() {

	}
}


class Line {

	constructor(pt1, pt2) {
		this.pt1 = 0
		this.pt2 = 0
		this.intersections = []
	}
}


class Circle {

	center
	radius
	start_angle
	end_angle
	start_point
	end_point
	intersection_objects	// [ shape1, shape2, shape3, ... shape45 ]
	intersection_points		// { "1": [] }

	constructor(center, radius, start=0, end=359.999) {

		this.center = center
		this.radius = radius
		this.start_angle = 0
		this.end_angle = 0
		this.start_point = null
		this.end_point = null

		if(typeof start === "object" && typeof end === "object") {
			this.start_point = start
			this.end_point = end
		}
		else {
			this.start_angle = start
			this.end_angle = end
		}
		this.intersection_objects = []
		this.intersection_points = []
	}

	from_intersection_with(shape, num) {

	}

	to_intersection_with(shape, num) {

	}

	points_from_perimeter(ratio) {

		let progress = 0
		let points = []
		while(progress < 1) {
			const x = this.center.x + this.radius * Math.cos(Math.PI * 2 * progress)
			const y = this.center.y + this.radius * Math.sin(Math.PI * 2 * progress)
			const pt = new Point(x, y)
			points.push(pt)
			progress += ratio
		}
		return points
	}
}


const NS = 'http://www.w3.org/2000/svg'
const r = 25

const svg = document.querySelector("svg > g")

// place origin circle

const geometry = new Geometry()

let c0 = geometry.createCircle(new Point(0, 0), r)
let c1 = geometry.createCircle(new Point(10, r), r)
c1.from_intersection_with(c0, 0)
c1.to_intersection_with(c0, 1)


// let pts = c.points_from_perimeter(1/6)
// let prev = null
// for(const pt of pts) {
// 	const c = new Circle(pt, r)
// 	shapes.push(c)
// }



let renderer = new SVGRenderer(svg)
renderer.render(geometry.shapes)

