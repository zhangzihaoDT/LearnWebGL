(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],[
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* eslint-disable no-undef */
let animatorInstance = null;
let tweens = [];
const vDoms = {};
const vDomIds = [];
let animeFrameId;
let onFrameExe = [];

if (typeof window === 'undefined') {
	global.window = {
		setTimeout: setTimeout,
		clearTimeout: clearTimeout
	};
	global.performance = {
		now: function () {
			return Date.now();
		}
	};
	global.document = {
	};
}
window.requestAnimationFrame = (function requestAnimationFrameG () {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function requestAnimationFrame (callback, element) {
		return window.setTimeout(callback, 1000 / 60);
	};
}());

window.cancelAnimFrame = (function cancelAnimFrameG () {
	return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function cancelAnimFrame (id) {
		return window.clearTimeout(id);
	};
}());

function Tween (Id, executable, easying) {
	this.executable = executable;
	this.duration = executable.duration ? executable.duration : 0;
	this.delay = executable.delay ? executable.delay : 0;
	this.lastTime = 0 - (executable.delay ? executable.delay : 0);
	this.loopTracker = 0;
	this.loop = executable.loop ? executable.loop : 0;
	this.direction = executable.direction;
	this.easying = easying;
	this.end = executable.end ? executable.end : null;

	if (this.direction === 'reverse') {
		this.factor = 1;
	} else {
		this.factor = 0;
	}
}

Tween.prototype.execute = function execute (f) {
	this.executable.run(f);
};

Tween.prototype.resetCallBack = function resetCallBack (_) {
	if (typeof _ !== 'function') return;
	this.callBack = _;
}; // function endExe (_) {
//   this.endExe = _
//   return this
// }

function onRequestFrame (_) {
	if (typeof _ !== 'function') {
		throw new Error('Wrong input');
	}

	onFrameExe.push(_);

	if (onFrameExe.length > 0 && !animeFrameId) {
		this.startAnimeFrames();
	}
}

function removeRequestFrameCall (_) {
	if (typeof _ !== 'function') {
		throw new Error('Wrong input');
	}

	let index = onFrameExe.indexOf(_);

	if (index !== -1) {
		onFrameExe.splice(index, 1);
	}
}

function add (uId, executable, easying) {
	let exeObj = new Tween(uId, executable, easying);
	exeObj.currTime = performance.now();
	if (executable.target) {
		if (!executable.target.animList) {
			executable.target.animList = [];
		}
		executable.target.animList[executable.target.animList.length] = exeObj;
	}
	tweens[tweens.length] = exeObj;
	this.startAnimeFrames();
}

function remove (exeObj) {
	let index = tweens.indexOf(exeObj);
	if (index !== -1) {
		tweens.splice(index, 1);
	}
}

function startAnimeFrames () {
	if (!animeFrameId) {
		animeFrameId = window.requestAnimationFrame(exeFrameCaller);
	}
}

function stopAnimeFrame () {
	if (animeFrameId) {
		window.cancelAnimFrame(animeFrameId);
		animeFrameId = null;
	}
}

function ExeQueue () {
}

ExeQueue.prototype = {
	startAnimeFrames,
	stopAnimeFrame,
	add,
	remove: remove,
	// end: endExe,
	onRequestFrame,
	removeRequestFrameCall,
	clearAll: function () {
		tweens = [];
		onFrameExe = []; // if (this.endExe) { this.endExe() }
		// this.stopAnimeFrame()
	}
};

ExeQueue.prototype.addVdom = function AaddVdom (_) {
	let ind = vDomIds.length + 1;
	vDoms[ind] = _;
	vDomIds.push(ind);
	this.startAnimeFrames();
	return ind;
};

ExeQueue.prototype.removeVdom = function removeVdom (_) {
	let index = vDomIds.indexOf(_);

	if (index !== -1) {
		vDomIds.splice(index, 1);
		vDoms[_].root.destroy();
		delete vDoms[_];
	}

	if (vDomIds.length === 0 && tweens.length === 0 && onFrameExe.length === 0) {
		this.stopAnimeFrame();
	}
};

ExeQueue.prototype.vDomChanged = function AvDomChanged (vDom) {
	if (vDoms[vDom] && vDoms[vDom].stateModified !== undefined) {
		vDoms[vDom].stateModified = true;
		vDoms[vDom].root.stateModified = true;
	} else if (typeof vDom === 'string') {
		let ids = vDom.split(':');
		if (vDoms[ids[0]] && vDoms[ids[0]].stateModified !== undefined) {
			vDoms[ids[0]].stateModified = true;
			vDoms[ids[0]].root.stateModified = true;
			let childRootNode = vDoms[ids[0]].root.fetchEl('#' + ids[1]);
			if (childRootNode) {
				childRootNode.stateModified = true;
			}
		}
	}
};

ExeQueue.prototype.execute = function Aexecute () {
	this.startAnimeFrames();
};

ExeQueue.prototype.vDomUpdates = function () {
	for (let i = 0, len = vDomIds.length; i < len; i += 1) {
		if (vDomIds[i] && vDoms[vDomIds[i]] && vDoms[vDomIds[i]].stateModified) {
			vDoms[vDomIds[i]].execute();
			vDoms[vDomIds[i]].stateModified = false;
			// vDoms[vDomIds[i]].onchange();
		} else if (vDomIds[i] && vDoms[vDomIds[i]] && vDoms[vDomIds[i]].root && vDoms[vDomIds[i]].root.ENV !== 'NODE') {
			var elementExists = document.getElementById(vDoms[vDomIds[i]].root.container.id);

			if (!elementExists) {
				this.removeVdom(vDomIds[i]);
			}
		}
	}
};

let d;
let t;
let abs = Math.abs;
let counter = 0;
let tweensN = [];

function exeFrameCaller () {
	try {
		tweensN = [];
		counter = 0;
		t = performance.now();

		for (let i = 0; i < tweens.length; i += 1) {
			d = tweens[i];
			d.lastTime += t - d.currTime;
			d.currTime = t;

			if (d.lastTime < d.duration && d.lastTime >= 0) {
				d.execute(abs(d.factor - d.easying(d.lastTime, d.duration)));
				tweensN[counter++] = d;
			} else if (d.lastTime > d.duration) {
				loopCheck(d);
			} else {
				tweensN[counter++] = d;
			}
		}

		tweens = tweensN;

		if (onFrameExe.length > 0) {
			onFrameExeFun();
		}

		animatorInstance.vDomUpdates();
	} catch (err) {
		console.error(err);
	} finally {
		animeFrameId = window.requestAnimationFrame(exeFrameCaller);
	}
}

function loopCheck (d) {
	if (d.loopTracker >= d.loop - 1) {
		d.execute(1 - d.factor);
		if (d.end) {
			d.end();
		}
		if (d.executable.target) {
			let animList = d.executable.target.animList;
			if (animList && animList.length > 0) {
				if (animList.length === 1) {
					d.executable.target.animList = [];
				} else if (animList.length > 1) {
					let index = animList.indexOf(d);
					if (index !== -1) {
						animList.splice(index, 1);
					}
				}
			}
		}
	} else {
		d.loopTracker += 1;
		d.lastTime = d.lastTime - d.duration;

		if (d.direction === 'alternate') {
			d.factor = 1 - d.factor;
		} else if (d.direction === 'reverse') {
			d.factor = 1;
		} else {
			d.factor = 0;
		}

		d.execute(abs(d.factor - d.easying(d.lastTime, d.duration)));
		tweensN[counter++] = d;
	}
}

function onFrameExeFun () {
	for (let i = 0; i < onFrameExe.length; i += 1) {
		onFrameExe[i](t);
	}
}

animatorInstance = new ExeQueue();

/* harmony default export */ __webpack_exports__["a"] = (animatorInstance); // default function animateQueue () {
//   if (!animatorInstance) { animatorInstance = new ExeQueue() }
//   return animatorInstance
// }

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(4)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = earcut;
module.exports.default = earcut;

function earcut(data, holeIndices, dim) {

    dim = dim || 2;

    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = linkedList(data, 0, outerLen, dim, true),
        triangles = [];

    if (!outerNode || outerNode.next === outerNode.prev) return triangles;

    var minX, minY, maxX, maxY, x, y, invSize;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 1 / invSize : 0;
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    var i, last;

    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
    }

    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    var p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) break;
            again = true;

        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

    var stop = ear,
        prev, next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);

            removeNode(ear);

            // skipping the next vertex leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    var p = ear.next.next;

    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

function isEarHashed(ear, minX, minY, invSize) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // triangle bbox; min & max are calculated like this for speed
    var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
        minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
        maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
        maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

    // z-order range for the current triangle bbox;
    var minZ = zOrder(minTX, minTY, minX, minY, invSize),
        maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

    var p = ear.prevZ,
        n = ear.nextZ;

    // look for points inside the triangle in both directions
    while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;

        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    // look for remaining points in decreasing z-order
    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    // look for remaining points in increasing z-order
    while (n && n.z <= maxZ) {
        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;

        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);

            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return filterPoints(p);
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);

                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, invSize);
                earcutLinked(c, triangles, dim, minX, minY, invSize);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }

    queue.sort(compareX);

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }

    return outerNode;
}

function compareX(a, b) {
    return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, hole);

        // filter collinear points around the cuts
        filterPoints(outerNode, outerNode.next);
        filterPoints(b, b.next);
    }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) return p;
                    if (hy === p.next.y) return p.next;
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;

    p = m;

    do {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if (locallyInside(p, hole) &&
                (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    } while (p !== stop);

    return m;
}

// whether sector in vertex m contains sector in vertex p in the same coordinates
function sectorContainsSector(m, p) {
    return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, invSize) {
    var p = start;
    do {
        if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }
            qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and inverse of the longer side of data bbox
function zOrder(x, y, minX, minY, invSize) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) * invSize;
    y = 32767 * (y - minY) * invSize;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
           (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
           (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
           (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
            (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
            equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
}

// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    var o1 = sign(area(p1, q1, p2));
    var o2 = sign(area(p1, q1, q2));
    var o3 = sign(area(p2, q2, p1));
    var o4 = sign(area(p2, q2, q1));

    if (o1 !== o2 && o3 !== o4) return true; // general case

    if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
    if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
    if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
    if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

    return false;
}

// for collinear points p, q, r, check if point q lies on segment pr
function onSegment(p, q, r) {
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

function sign(num) {
    return num > 0 ? 1 : num < 0 ? -1 : 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;

    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
    // vertex index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;

    // previous and next vertex nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = null;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;

    // indicates whether this is a steiner point
    this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }

    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};

function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};


/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/i2djs/src/modules/queue.js
var queue = __webpack_require__(0);

// CONCATENATED MODULE: ./node_modules/i2djs/src/modules/VDom.js
/* eslint-disable no-undef */
function VDom () {}

VDom.prototype.execute = function execute () {
	this.root.execute();
	this.stateModified = false;
};

VDom.prototype.rootNode = function root (_) {
	this.root = _;
	this.stateModified = true;
};

VDom.prototype.eventsCheck = function eventsCheck (nodes, mouseCoor, rawEvent) {
	const self = this;
	let node, temp;

	for (var i = 0; i <= nodes.length - 1; i += 1) {
		var d = nodes[i];
		var coOr = {
			x: mouseCoor.x,
			y: mouseCoor.y
		};
		transformCoOr(d, coOr);

		if (d.in({
			x: coOr.x,
			y: coOr.y
		})) {
			if (d.children && d.children.length > 0) {
				temp = self.eventsCheck(d.children, {
					x: coOr.x,
					y: coOr.y
				}, rawEvent);

				if (temp) {
					node = temp;
				}
			} else {
				node = d;
			}
		}
	}

	return node;
};

VDom.prototype.transformCoOr = transformCoOr;

// VDom.prototype.onchange = function () {
// 	// this.root.invokeOnChange();
// };

function transformCoOr (d, coOr) {
	let hozMove = 0;
	let verMove = 0;
	let scaleX = 1;
	let scaleY = 1;
	const coOrLocal = coOr;

	if (d.attr.transform && d.attr.transform.translate) {
		[hozMove, verMove] = d.attr.transform.translate;
		coOrLocal.x -= hozMove;
		coOrLocal.y -= verMove;
	}

	if (d.attr.transform && d.attr.transform.scale) {
		scaleX = d.attr.transform.scale[0] !== undefined ? d.attr.transform.scale[0] : 1;
		scaleY = d.attr.transform.scale[1] !== undefined ? d.attr.transform.scale[1] : scaleX;
		coOrLocal.x /= scaleX;
		coOrLocal.y /= scaleY;
	}

	if (d.attr.transform && d.attr.transform.rotate) {
		const rotate = d.attr.transform.rotate[0];

		const cen = {
			x: d.attr.transform.rotate[1],
			y: d.attr.transform.rotate[2]
		};
		let x = coOrLocal.x;
		let y = coOrLocal.y;
		let cx = cen.x;
		let cy = cen.y;
		var radians = Math.PI / 180 * rotate;
		var cos = Math.cos(radians);
		var sin = Math.sin(radians);
		coOrLocal.x = (cos * (x - cx)) + (sin * (y - cy)) + cx;
		coOrLocal.y = (cos * (y - cy)) - (sin * (x - cx)) + cy;
	}
}

/* harmony default export */ var modules_VDom = (VDom);

// CONCATENATED MODULE: ./node_modules/i2djs/src/modules/colorMap.js
/* eslint-disable no-undef */
const preDefinedColors = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGrey', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen', 'DarkOrange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGray', 'DarkSlateGrey', 'DarkTurquoise', 'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod', 'Gray', 'Grey', 'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed', 'Indigo', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin', 'NavajoWhite', 'Navy', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'RebeccaPurple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SlateGrey', 'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'WhiteSmoke', 'Yellow', 'YellowGreen'];
const preDefinedColorHex = ['f0f8ff', 'faebd7', '00ffff', '7fffd4', 'f0ffff', 'f5f5dc', 'ffe4c4', '000000', 'ffebcd', '0000ff', '8a2be2', 'a52a2a', 'deb887', '5f9ea0', '7fff00', 'd2691e', 'ff7f50', '6495ed', 'fff8dc', 'dc143c', '00ffff', '00008b', '008b8b', 'b8860b', 'a9a9a9', 'a9a9a9', '006400', 'bdb76b', '8b008b', '556b2f', 'ff8c00', '9932cc', '8b0000', 'e9967a', '8fbc8f', '483d8b', '2f4f4f', '2f4f4f', '00ced1', '9400d3', 'ff1493', '00bfff', '696969', '696969', '1e90ff', 'b22222', 'fffaf0', '228b22', 'ff00ff', 'dcdcdc', 'f8f8ff', 'ffd700', 'daa520', '808080', '808080', '008000', 'adff2f', 'f0fff0', 'ff69b4', 'cd5c5c', '4b0082', 'fffff0', 'f0e68c', 'e6e6fa', 'fff0f5', '7cfc00', 'fffacd', 'add8e6', 'f08080', 'e0ffff', 'fafad2', 'd3d3d3', 'd3d3d3', '90ee90', 'ffb6c1', 'ffa07a', '20b2aa', '87cefa', '778899', '778899', 'b0c4de', 'ffffe0', '00ff00', '32cd32', 'faf0e6', 'ff00ff', '800000', '66cdaa', '0000cd', 'ba55d3', '9370db', '3cb371', '7b68ee', '00fa9a', '48d1cc', 'c71585', '191970', 'f5fffa', 'ffe4e1', 'ffe4b5', 'ffdead', '000080', 'fdf5e6', '808000', '6b8e23', 'ffa500', 'ff4500', 'da70d6', 'eee8aa', '98fb98', 'afeeee', 'db7093', 'ffefd5', 'ffdab9', 'cd853f', 'ffc0cb', 'dda0dd', 'b0e0e6', '800080', '663399', 'ff0000', 'bc8f8f', '4169e1', '8b4513', 'fa8072', 'f4a460', '2e8b57', 'fff5ee', 'a0522d', 'c0c0c0', '87ceeb', '6a5acd', '708090', '708090', 'fffafa', '00ff7f', '4682b4', 'd2b48c', '008080', 'd8bfd8', 'ff6347', '40e0d0', 'ee82ee', 'f5deb3', 'ffffff', 'f5f5f5', 'ffff00', '9acd32'];
const colorMap = {};
const round = Math.round;
var defaultColor = 'rgba(0,0,0,0)';

for (let i = 0; i < preDefinedColors.length; i += 1) {
	colorMap[preDefinedColors[i]] = preDefinedColorHex[i];
}

function RGBA (r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a === undefined ? 255 : a;
	this.rgba = `rgba(${r},${g},${b},${a})`;
}

RGBA.prototype.normalize = function () {
	if (!this.normalFlag) {
		this.r /= 255;
		this.g /= 255;
		this.b /= 255;
		this.a /= 255;
		this.normalFlag = true;
	}
	return this;
};

function nameToHex (name) {
	return colorMap[name] ? `#${colorMap[name]}` : '#000';
}

function hexToRgb (hex) {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return new RGBA(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 255);
}

function rgbToHex (rgb) {
	const rgbComponents = rgb.substring(rgb.lastIndexOf('(') + 1, rgb.lastIndexOf(')')).split(',');
	const r = parseInt(rgbComponents[0], 10);
	const g = parseInt(rgbComponents[1], 10);
	const b = parseInt(rgbComponents[2], 10);
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function rgbParse (rgb) {
	const res = rgb.replace(/[^0-9.,]+/g, '').split(',');
	const obj = {};
	const flags = ['r', 'g', 'b', 'a'];

	for (let i = 0; i < res.length; i += 1) {
		obj[flags[i]] = parseFloat(res[i]);
	}

	return new RGBA(obj.r, obj.g, obj.b, obj.a);
}

function hslParse (hsl) {
	var r;
	var g;
	var b;
	var a;
	var h;
	var s;
	var l;
	var obj = {};
	const res = hsl.replace(/[^0-9.,]+/g, '').split(',').map(function (d) {
		return parseFloat(d);
	});
	h = res[0] / 360;
	s = res[1] / 100;
	l = res[2] / 100;
	a = res[3];

	if (s === 0) {
		r = g = b = l;
	} else {
		var hue2rgb = function hue2rgb (p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + ((q - p) * 6 * t);
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + ((q - p) * ((2 / 3) - t) * 6);
			return p;
		};

		var q = l < 0.5 ? l * (1 + s) : l + s - (l * s);
		var p = (2 * l) - q;
		r = hue2rgb(p, q, h + (1 / 3)) * 255;
		g = hue2rgb(p, q, h) * 255;
		b = hue2rgb(p, q, h - (1 / 3)) * 255;
	}

	if (a !== undefined) obj.a = a;
	return new RGBA(r, g, b, a);
}

function colorToRGB (val) {
	return val instanceof RGBA ? val : val.startsWith('#') ? hexToRgb(val) : val.startsWith('rgb') ? rgbParse(val) : val.startsWith('hsl') ? hslParse(val) : {
		r: 0,
		g: 0,
		b: 0,
		a: 255
	};
}

function colorRGBtransition (src, dest) {
	src = src || defaultColor;
	dest = dest || defaultColor;
	src = colorToRGB(src);
	dest = colorToRGB(dest);
	return function trans (f) {
		return new RGBA(round(src.r + ((dest.r - src.r) * f)), round(src.g + ((dest.g - src.g) * f)), round(src.b + ((dest.b - src.b) * f)), round(src.a + ((dest.a - src.a) * f)));
	};
}

function rgbaInstance (r, g, b, a) {
	return new RGBA(r, g, b, a);
}

function isTypeColor (value) {
	return value instanceof RGBA || value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl');
}

/* harmony default export */ var modules_colorMap = ({
	nameToHex: nameToHex,
	hexToRgb: hexToRgb,
	rgbToHex: rgbToHex,
	hslToRgb: hslParse,
	transition: colorRGBtransition,
	colorToRGB: colorToRGB,
	rgba: rgbaInstance,
	isTypeColor: isTypeColor,
	RGBAInstanceCheck: function (_) {
		return _ instanceof RGBA;
	}
});

// CONCATENATED MODULE: ./node_modules/i2djs/src/modules/shaders.js
/* eslint-disable no-undef */
function shaders (el) {
	let res;

	switch (el) {
		case 'point':
			res = {
				vertexShader: `
          precision highp float;
          attribute vec2 a_position;
          attribute vec4 a_color;
          attribute float a_size;
          
          uniform vec2 u_resolution;
          uniform vec2 u_translate;
          uniform vec2 u_scale;
          
          varying vec4 v_color;
          void main() {
            vec2 zeroToOne = (u_scale * (a_position + u_translate)) / u_resolution;
            vec2 clipSpace = ((zeroToOne) * 2.0) - 1.0;
            gl_Position = vec4((clipSpace * vec2(1.0, -1.0)), 0, 1);
            gl_PointSize = a_size;
            v_color = a_color;
          }
          `,
				fragmentShader: `
                    precision mediump float;
                    varying vec4 v_color;
                    void main() {
                        gl_FragColor = v_color;
                    }
                    `
			};
			break;

		case 'circle':
			res = {
				vertexShader: `
        precision highp float;
          attribute vec2 a_position;
          attribute vec4 a_color;
          attribute float a_radius;
          uniform vec2 u_resolution;
          uniform vec2 u_translate;
          uniform vec2 u_scale;
          varying vec4 v_color;
          void main() {
            vec2 zeroToOne = (u_scale * (a_position + u_translate)) / u_resolution;
            vec2 zeroToTwo = zeroToOne * 2.0;
            vec2 clipSpace = zeroToTwo - 1.0;
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            gl_PointSize = a_radius;
            v_color = a_color;
          }
          `,
				fragmentShader: `
                    precision mediump float;
                    varying vec4 v_color;
                    void main() {
                      float r = 0.0, delta = 0.0, alpha = 1.0;
                      vec2 cxy = 2.0 * gl_PointCoord - 1.0;
                      r = dot(cxy, cxy);
                      if(r > 1.0) {
                        discard;
                      }
                      delta = 0.09;
                      alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
                      gl_FragColor = v_color * alpha;
                    }
                    `
			};
			break;

		case 'ellipse':
			res = {
				vertexShader: `
        precision highp float;
          attribute vec2 a_position;
          attribute vec4 a_color;
          attribute float a_r1;
          attribute float a_r2;
          uniform vec2 u_resolution;
          uniform vec2 u_translate;
          uniform vec2 u_scale;
          varying vec4 v_color;
          varying float v_r1;
          varying float v_r2;
          void main() {
            vec2 zeroToOne = (u_scale * (a_position + u_translate)) / u_resolution;
            vec2 zeroToTwo = zeroToOne * 2.0;
            vec2 clipSpace = zeroToTwo - 1.0;
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            gl_PointSize = max(a_r1, a_r2);
            v_color = a_color;
            v_r1 = a_r1;
            v_r2 = a_r2;
          }
          `,
				fragmentShader: `
                    precision mediump float;
                    varying vec4 v_color;
                    varying float v_r1;
                    varying float v_r2;
                    void main() {
                      float r = 0.0, delta = 0.0, alpha = 1.0;
                      vec2 cxy = 2.0 * gl_PointCoord - 1.0;
                      r = ((cxy.x * cxy.x) / (v_r1 * v_r1), (cxy.y * cxy.y) / (v_r2 * v_r2));
                      if(r > 1.0) {
                        discard;
                      }
                      delta = 0.09;
                      alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
                      gl_FragColor = v_color * alpha;
                    }
                    `
			};
			break;

		case 'image':
			res = {
				vertexShader: `
                    precision highp float;
                    attribute vec2 a_position;
                    attribute vec2 a_texCoord;
                    uniform vec2 u_resolution;
                    uniform vec2 u_translate;
                    uniform vec2 u_scale;
                    varying vec2 v_texCoord;
                    void main() {
                      vec2 zeroToOne = (u_scale * (a_position + u_translate)) / u_resolution;
                      vec2 clipSpace = zeroToOne * 2.0 - 1.0;
                      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
                      v_texCoord = a_texCoord;
                    }
          `,
				fragmentShader: `
                    precision mediump float;
                    uniform sampler2D u_image;
                    varying vec2 v_texCoord;
                    void main() {
                      gl_FragColor = texture2D(u_image, v_texCoord);
                    }
                    `
			};
			break;

		case 'polyline':
		case 'polygon':
			res = {
				vertexShader: `
                    precision highp float;
                    attribute vec2 a_position;
                    uniform vec2 u_resolution;
                    uniform vec2 u_translate;
                    uniform vec2 u_scale;
                    void main() {
                    vec2 zeroToOne = (u_scale * (a_position + u_translate)) / u_resolution;
                    vec2 clipSpace = zeroToOne * 2.0 - 1.0;
                    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
                    }
                    `,
				fragmentShader: `
                    precision mediump float;
                    uniform vec4 u_color;
                    void main() {
                        gl_FragColor = u_color;
                    }
                    `
			};
			break;

		default:
			res = {
				vertexShader: `
                    precision highp float;
                    attribute vec2 a_position;
                    attribute vec4 a_color;
                    uniform vec2 u_resolution;
                    uniform vec2 u_translate;
                    uniform vec2 u_scale;
                    varying vec4 v_color;
                    void main() {
                    vec2 zeroToOne = (u_scale * (a_position + u_translate)) / u_resolution;
                    vec2 clipSpace = zeroToOne * 2.0 - 1.0;
                    gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0, 1);
                    v_color = a_color;
                    }
                    `,
				fragmentShader: `
                    precision mediump float;
                    varying vec4 v_color;
                    void main() {
                        gl_FragColor = v_color;
                    }
                    `
			};
	}

	return res;
}

/* harmony default export */ var modules_shaders = (shaders);

// EXTERNAL MODULE: ./node_modules/earcut/src/earcut.js
var earcut = __webpack_require__(1);
var earcut_default = /*#__PURE__*/__webpack_require__.n(earcut);

// CONCATENATED MODULE: ./node_modules/i2djs/src/modules/geometry.js
/* eslint-disable no-undef */
let sqrt = Math.sqrt;
let sin = Math.sin;
let cos = Math.cos;
let abs = Math.abs;
let atan2 = Math.atan2;
let tan = Math.tan;
let PI = Math.PI;
let ceil = Math.ceil;
let max = Math.max;

function pw (a, x) {
	let val = 1;
	if (x === 0) return val;

	for (let i = 1; i <= x; i += 1) {
		val *= a;
	}

	return val;
}

// function angleToRadian (_) {
//   if (isNaN(_)) { throw new Error('NaN') }
//   return (Math.PI / 180) * _
// }
// function radianToAngle (_) {
//   if (isNaN(_)) { throw new Error('NaN') }
//   return (180 / Math.PI) * _
// }
// function getAngularDistance (r1, r2) {
//   if (isNaN(r1 - r2)) { throw new Error('NaN') }
//   return r1 - r2
// }

function bezierLength (p0, p1, p2) {
	const a = {};
	const b = {};
	a.x = p0.x + p2.x - (2 * p1.x);
	a.y = p0.y + p2.y - (2 * p1.y);
	b.x = (2 * p1.x) - (2 * p0.x);
	b.y = (2 * p1.y) - (2 * p0.y);
	const A = 4 * ((a.x * a.x) + (a.y * a.y));
	const B = 4 * ((a.x * b.x) + (a.y * b.y));
	const C = (b.x * b.x) + (b.y * b.y);
	const Sabc = 2 * sqrt(A + B + C);
	const A_2 = sqrt(A);
	const A_32 = 2 * A * A_2;
	const C_2 = 2 * sqrt(C);
	const BA = B / A_2;
	let logVal = ((2 * A_2) + BA + Sabc) / (BA + C_2);
	logVal = isNaN(logVal) || abs(logVal) === Infinity ? 1 : logVal;
	return ((A_32 * Sabc) + (A_2 * B * (Sabc - C_2)) + (((4 * C * A) - (B * B)) * Math.log(logVal))) / (4 * A_32);
} // function bezierLengthOld (p0, p1, p2) {
//   const interval = 0.001
//   let sum = 0
//   const bezierTransitionInstance = bezierTransition.bind(null, p0, p1, p2)
//   // let p1
//   // let p2
//   for (let i = 0; i <= 1 - interval; i += interval) {
//     p1 = bezierTransitionInstance(i)
//     p2 = bezierTransitionInstance(i + interval)
//     sum += sqrt(pw((p2.x - p1.x) / interval, 2) + (pw((p2.y - p1.y) / interval, 2))) * interval
//   }
//   return sum
// }

function cubicBezierLength (p0, co) {
	const interval = 0.001;
	let sum = 0;
	const cubicBezierTransitionInstance = cubicBezierTransition.bind(null, p0, co);
	let p1;
	let p2;

	for (let i = 0; i <= 1; i += interval) {
		p1 = cubicBezierTransitionInstance(i);
		p2 = cubicBezierTransitionInstance(i + interval);
		sum += sqrt(pw((p2.x - p1.x) / interval, 2) + pw((p2.y - p1.y) / interval, 2)) * interval;
	}

	return sum;
}

function getDistance (p1, p2) {
	let cPw = 0;

	for (const p in p1) {
		cPw += pw(p2[p] - p1[p], 2);
	}

	if (isNaN(cPw)) {
		throw new Error('error');
	}

	return sqrt(cPw);
}

function get2DAngle (p1, p2) {
	return atan2(p2.x - p1.x, p2.y - p1.y);
}

function scaleAlongOrigin (co, factor) {
	const co_ = {};

	for (const prop in co) {
		co_[prop] = co[prop] * factor;
	}

	return co_;
}

function scaleAlongPoint (p, r, f) {
	const s = (p.y - r.y) / (p.x - r.x);
	const xX = p.x * f;
	const yY = ((s * (xX - r.x)) + r.y) * f;
	return {
		x: xX,
		y: yY
	};
}

function cubicBezierCoefficients (p) {
	const cx = 3 * (p.cntrl1.x - p.p0.x);
	const bx = (3 * (p.cntrl2.x - p.cntrl1.x)) - cx;
	const ax = p.p1.x - p.p0.x - cx - bx;
	const cy = 3 * (p.cntrl1.y - p.p0.y);
	const by = (3 * (p.cntrl2.y - p.cntrl1.y)) - cy;
	const ay = p.p1.y - p.p0.y - cy - by;
	return {
		cx,
		bx,
		ax,
		cy,
		by,
		ay
	};
}

function toCubicCurves (stack) {
	if (!stack.length) {
		return;
	}

	const _ = stack;
	const mappedArr = [];

	for (let i = 0; i < _.length; i += 1) {
		if (['M', 'C', 'S', 'Q'].indexOf(_[i].type) !== -1) {
			mappedArr.push(_[i]);
		} else if (['V', 'H', 'L', 'Z'].indexOf(_[i].type) !== -1) {
			const ctrl1 = {
				x: (_[i].p0.x + _[i].p1.x) / 2,
				y: (_[i].p0.y + _[i].p1.y) / 2
			};
			mappedArr.push({
				p0: _[i].p0,
				cntrl1: ctrl1,
				cntrl2: ctrl1,
				p1: _[i].p1,
				type: 'C',
				length: _[i].length
			});
		} else {
			console.log('wrong cmd type');
		}
	}

	return mappedArr;
}

function cubicBezierTransition (p0, co, f) {
	const p3 = pw(f, 3);
	const p2 = pw(f, 2);
	return {
		x: (co.ax * p3) + (co.bx * p2) + (co.cx * f) + p0.x,
		y: (co.ay * p3) + (co.by * p2) + (co.cy * f) + p0.y
	};
}

function bezierTransition (p0, p1, p2, f) {
	return {
		x: ((p0.x - (2 * p1.x) + p2.x) * f * f) + (((2 * p1.x) - (2 * p0.x)) * f) + p0.x,
		y: ((p0.y - (2 * p1.y) + p2.y) * f * f) + (((2 * p1.y) - (2 * p0.y)) * f) + p0.y
	};
}

function linearTBetweenPoints (p1, p2, f) {
	return {
		x: p1.x + ((p2.x - p1.x) * f),
		y: p1.y + ((p2.y - p1.y) * f)
	};
}

function intermediateValue (v1, v2, f) {
	return v1 + ((v2 - v1) * f);
}

function getBBox (gcmxArr) {
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity; // const exe = []

	let d;
	let point;

	for (var j = 0; j < gcmxArr.length; j++) {
		let cmxArr = gcmxArr[j];
		for (let i = 0; i < cmxArr.length; i += 1) {
			d = cmxArr[i];

			if (['V', 'H', 'L', 'v', 'h', 'l'].indexOf(d.type) !== -1) {
				[d.p0 ? d.p0 : cmxArr[i - 1].p1, d.p1].forEach(function (point) {
					if (point.x < minX) {
						minX = point.x;
					}

					if (point.x > maxX) {
						maxX = point.x;
					}

					if (point.y < minY) {
						minY = point.y;
					}

					if (point.y > maxY) {
						maxY = point.y;
					}
				});
			} else if (['Q', 'C', 'q', 'c'].indexOf(d.type) !== -1) {
				const co = cubicBezierCoefficients(d);
				let exe = cubicBezierTransition.bind(null, d.p0, co);
				let ii = 0;
				let point;

				while (ii < 1) {
					point = exe(ii);
					ii += 0.05;

					if (point.x < minX) {
						minX = point.x;
					}

					if (point.x > maxX) {
						maxX = point.x;
					}

					if (point.y < minY) {
						minY = point.y;
					}

					if (point.y > maxY) {
						maxY = point.y;
					}
				}
			} else {
				point = d.p0;

				if (point.x < minX) {
					minX = point.x;
				}

				if (point.x > maxX) {
					maxX = point.x;
				}

				if (point.y < minY) {
					minY = point.y;
				}

				if (point.y > maxY) {
					maxY = point.y;
				}
			}
		}
	};

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY
	};
}

const _slicedToArray = (function () {
	function sliceIterator (arr, i) {
		const _arr = [];
		let _n = true;
		let _d = false;

		let _e;

		try {
			for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
				_arr.push(_s.value);

				if (i && _arr.length === i) break;
			}
		} catch (err) {
			_d = true;
			_e = err;
		} finally {
			try {
				if (!_n && _i.return) _i.return();
			} finally {
				if (_d) {
					console.log('Error -' + _e);
				}
			}
		}

		return _arr;
	}

	return function (arr, i) {
		if (Array.isArray(arr)) {
			return arr;
		} else if (Symbol.iterator in Object(arr)) {
			return sliceIterator(arr, i);
		}

		throw new TypeError('Invalid attempt to destructure non-iterable instance');
	};
}());

const TAU = PI * 2;

const mapToEllipse = function mapToEllipse (_ref, rx, ry, cosphi, sinphi, centerx, centery) {
	let {
		x,
		y
	} = _ref;
	x *= rx;
	y *= ry;
	const xp = (cosphi * x) - (sinphi * y);
	const yp = (sinphi * x) + (cosphi * y);
	return {
		x: xp + centerx,
		y: yp + centery
	};
};

const approxUnitArc = function approxUnitArc (ang1, ang2) {
	const a = 4 / 3 * tan(ang2 / 4);
	const x1 = cos(ang1);
	const y1 = sin(ang1);
	const x2 = cos(ang1 + ang2);
	const y2 = sin(ang1 + ang2);
	return [{
		x: x1 - (y1 * a),
		y: y1 + (x1 * a)
	}, {
		x: x2 + (y2 * a),
		y: y2 - (x2 * a)
	}, {
		x: x2,
		y: y2
	}];
};

const vectorAngle = function vectorAngle (ux, uy, vx, vy) {
	const sign = ((ux * vy) - (uy * vx)) < 0 ? -1 : 1;
	const umag = sqrt((ux * ux) + (uy * uy));
	const vmag = sqrt((ux * ux) + (uy * uy));
	const dot = (ux * vx) + (uy * vy);
	let div = dot / (umag * vmag);

	if (div > 1) {
		div = 1;
	}

	if (div < -1) {
		div = -1;
	}

	return sign * Math.acos(div);
};

const getArcCenter = function getArcCenter (px, py, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinphi, cosphi, pxp, pyp) {
	const rxsq = pw(rx, 2);
	const rysq = pw(ry, 2);
	const pxpsq = pw(pxp, 2);
	const pypsq = pw(pyp, 2);
	let radicant = (rxsq * rysq) - (rxsq * pypsq) - (rysq * pxpsq);

	if (radicant < 0) {
		radicant = 0;
	}

	radicant /= (rxsq * pypsq) + (rysq * pxpsq);
	radicant = sqrt(radicant) * (largeArcFlag === sweepFlag ? -1 : 1);
	const centerxp = radicant * rx / ry * pyp;
	const centeryp = radicant * -ry / rx * pxp;
	const centerx = (cosphi * centerxp) - (sinphi * centeryp) + ((px + cx) / 2);
	const centery = (sinphi * centerxp) + (cosphi * centeryp) + ((py + cy) / 2);
	const vx1 = (pxp - centerxp) / rx;
	const vy1 = (pyp - centeryp) / ry;
	const vx2 = (-pxp - centerxp) / rx;
	const vy2 = (-pyp - centeryp) / ry;
	const ang1 = vectorAngle(1, 0, vx1, vy1);
	let ang2 = vectorAngle(vx1, vy1, vx2, vy2);

	if (sweepFlag === 0 && ang2 > 0) {
		ang2 -= TAU;
	}

	if (sweepFlag === 1 && ang2 < 0) {
		ang2 += TAU;
	}

	return [centerx, centery, ang1, ang2];
};

const arcToBezier = function arcToBezier (_ref2) {
	let {
		px,
		py,
		cx,
		cy,
		rx,
		ry
	} = _ref2;
	const _ref2$xAxisRotation = _ref2.xAxisRotation;
	const xAxisRotation = _ref2$xAxisRotation === undefined ? 0 : _ref2$xAxisRotation;
	const _ref2$largeArcFlag = _ref2.largeArcFlag;
	const largeArcFlag = _ref2$largeArcFlag === undefined ? 0 : _ref2$largeArcFlag;
	const _ref2$sweepFlag = _ref2.sweepFlag;
	const sweepFlag = _ref2$sweepFlag === undefined ? 0 : _ref2$sweepFlag;
	const curves = [];

	if (rx === 0 || ry === 0) {
		return [];
	}

	const sinphi = sin(xAxisRotation * TAU / 360);
	const cosphi = cos(xAxisRotation * TAU / 360);
	const pxp = (cosphi * (px - cx) / 2) + (sinphi * (py - cy) / 2);
	const pyp = (-sinphi * (px - cx) / 2) + (cosphi * (py - cy) / 2);

	if (pxp === 0 && pyp === 0) {
		return [];
	}

	rx = abs(rx);
	ry = abs(ry);
	const lambda = (pw(pxp, 2) / pw(rx, 2)) + (pw(pyp, 2) / pw(ry, 2));

	if (lambda > 1) {
		rx *= sqrt(lambda);
		ry *= sqrt(lambda);
	}

	const _getArcCenter = getArcCenter(px, py, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinphi, cosphi, pxp, pyp);

	const _getArcCenter2 = _slicedToArray(_getArcCenter, 4);

	const centerx = _getArcCenter2[0];
	const centery = _getArcCenter2[1];
	let ang1 = _getArcCenter2[2];
	let ang2 = _getArcCenter2[3];
	const segments = max(ceil(abs(ang2) / (TAU / 4)), 1);
	ang2 /= segments;

	for (let i = 0; i < segments; i++) {
		curves.push(approxUnitArc(ang1, ang2));
		ang1 += ang2;
	}

	return curves.map(curve => {
		const _mapToEllipse = mapToEllipse(curve[0], rx, ry, cosphi, sinphi, centerx, centery);

		const x1 = _mapToEllipse.x;
		const y1 = _mapToEllipse.y;

		const _mapToEllipse2 = mapToEllipse(curve[1], rx, ry, cosphi, sinphi, centerx, centery);

		const x2 = _mapToEllipse2.x;
		const y2 = _mapToEllipse2.y;

		const _mapToEllipse3 = mapToEllipse(curve[2], rx, ry, cosphi, sinphi, centerx, centery);

		const x = _mapToEllipse3.x;
		const y = _mapToEllipse3.y;
		return {
			x1,
			y1,
			x2,
			y2,
			x,
			y
		};
	});
};

function rotatePoint (point, centre, newAngle, distance) {
	const p = {};
	let x = point.x;
	let y = point.y;
	let cx = centre.x;
	let cy = centre.y;

	var radians = PI / 180 * newAngle;
	var c_ = cos(-radians);
	var s_ = sin(-radians);
	p.x = (c_ * (x - cx)) + (s_ * (y - cy)) + cx;
	p.y = (c_ * (y - cy)) - (s_ * (x - cx)) + cy;
	return {
		x: (c_ * (x - cx)) + (s_ * (y - cy)) + cx,
		y: (c_ * (y - cy)) - (s_ * (x - cx)) + cy
	};
}

function rotateBBox (BBox, transform) {
	let point1 = {
		x: BBox.x,
		y: BBox.y
	};
	let point2 = {
		x: BBox.x + BBox.width,
		y: BBox.y
	};
	let point3 = {
		x: BBox.x,
		y: BBox.y + BBox.height
	};
	let point4 = {
		x: BBox.x + BBox.width,
		y: BBox.y + BBox.height
	};
	const {
		translate,
		rotate
	} = transform;
	const cen = {
		x: rotate[1] || 0,
		y: rotate[2] || 0
	};
	const rotateAngle = rotate[0];

	if (translate && translate.length > 0) {
		cen.x += translate[0];
		cen.y += translate[1];
	}

	point1 = rotatePoint(point1, cen, rotateAngle, getDistance(point1, cen));
	point2 = rotatePoint(point2, cen, rotateAngle, getDistance(point2, cen));
	point3 = rotatePoint(point3, cen, rotateAngle, getDistance(point3, cen));
	point4 = rotatePoint(point4, cen, rotateAngle, getDistance(point4, cen));
	const xVec = [point1.x, point2.x, point3.x, point4.x].sort((bb, aa) => bb - aa);
	const yVec = [point1.y, point2.y, point3.y, point4.y].sort((bb, aa) => bb - aa);
	return {
		x: xVec[0],
		y: yVec[0],
		width: xVec[3] - xVec[0],
		height: yVec[3] - yVec[0]
	};
}

function Geometry () {
}

Geometry.prototype = {
	pow: pw,
	getAngle: get2DAngle,
	getDistance,
	scaleAlongOrigin,
	scaleAlongPoint,
	linearTransitionBetweenPoints: linearTBetweenPoints,
	bezierTransition,
	bezierLength,
	cubicBezierTransition,
	cubicBezierLength,
	cubicBezierCoefficients,
	arcToBezier,
	intermediateValue,
	getBBox,
	toCubicCurves,
	rotatePoint,
	rotateBBox
};
/* harmony default export */ var geometry = (new Geometry());

// CONCATENATED MODULE: ./node_modules/i2djs/src/modules/ease.js
/* eslint-disable no-undef */


const t2DGeometry = geometry;

function linear (starttime, duration) {
	return starttime / duration;
}

function elastic (starttime, duration) {
	const decay = 8;
	const force = 2 / 1000;
	const t = starttime / duration;
	return 1 - ((1 - t) * Math.sin((t * duration * force * Math.PI * 2) + (Math.PI / 2)) / Math.exp(t * decay));
}

function bounce (starttime, duration) {
	const decay = 10;
	const t = starttime / duration;
	const force = t / 100;
	return 1 - ((1 - t) * Math.abs(Math.sin((t * duration * force * Math.PI * 2) + (Math.PI / 2))) / Math.exp(t * decay));
}

function easeInQuad (starttime, duration) {
	const t = starttime / duration;
	return t * t;
}

function easeOutQuad (starttime, duration) {
	const t = starttime / duration;
	return t * (2 - t);
}

function easeInOutQuad (starttime, duration) {
	const t = starttime / duration;
	return t < 0.5 ? 2 * t * t : -1 + ((4 - (2 * t)) * t);
}

function easeInCubic (starttime, duration) {
	const t = starttime / duration;
	return t2DGeometry.pow(t, 3);
}

function easeOutCubic (starttime, duration) {
	let t = starttime / duration;
	t -= 1;
	return (t * t * t) + 1;
}

function easeInOutCubic (starttime, duration) {
	const t = starttime / duration;
	return t < 0.5 ? 4 * t2DGeometry.pow(t, 3) : ((t - 1) * ((2 * t) - 2) * ((2 * t) - 2)) + 1;
}

function sinIn (starttime, duration) {
	const t = starttime / duration;
	return 1 - Math.cos(t * Math.PI / 2);
}

function easeOutSin (starttime, duration) {
	const t = starttime / duration;
	return Math.cos(t * Math.PI / 2);
}

function easeInOutSin (starttime, duration) {
	const t = starttime / duration;
	return (1 - Math.cos(Math.PI * t)) / 2;
} // function easeInQuart (starttime, duration) {
//   const t = starttime / duration
//   return t2DGeometry.pow(t, 4)
// }
// function easeOutQuart (starttime, duration) {
//   let t = starttime / duration
//   t -= 1
//   return 1 - t * t2DGeometry.pow(t, 3)
// }
// function easeInOutQuart (starttime, duration) {
//   let t = starttime / duration
//   t -= 1
//   return t < 0.5 ? 8 * t2DGeometry.pow(t, 4) : 1 - 8 * t * t2DGeometry.pow(t, 3)
// }

function fetchTransitionType (_) {
	let res;

	if (typeof _ === 'function') {
		return function custExe (starttime, duration) {
			return _(starttime / duration);
		};
	}

	switch (_) {
		case 'easeOutQuad':
			res = easeOutQuad;
			break;

		case 'easeInQuad':
			res = easeInQuad;
			break;

		case 'easeInOutQuad':
			res = easeInOutQuad;
			break;

		case 'easeInCubic':
			res = easeInCubic;
			break;

		case 'easeOutCubic':
			res = easeOutCubic;
			break;

		case 'easeInOutCubic':
			res = easeInOutCubic;
			break;

		case 'easeInSin':
			res = sinIn;
			break;

		case 'easeOutSin':
			res = easeOutSin;
			break;

		case 'easeInOutSin':
			res = easeInOutSin;
			break;

		case 'bounce':
			res = bounce;
			break;

		case 'linear':
			res = linear;
			break;

		case 'elastic':
			res = elastic;
			break;

		default:
			res = linear;
	}

	return res;
}

// CONCATENATED MODULE: ./node_modules/i2djs/src/modules/coreApi.js
/* eslint-disable no-undef */
// import { geometry, queue, ease, chain, colorMap, path } from './'





let animeIdentifier = 0;
const coreApi_t2DGeometry = geometry;
const easing = fetchTransitionType;
const queueInstance = queue["a" /* default */];

function animeId () {
	animeIdentifier += 1;
	return animeIdentifier;
}

let transitionSetAttr = function transitionSetAttr (self, key, value) {
	return function inner (f) {
		self.setAttr(key, value.call(self, f));
	};
};

let transformTransition = function transformTransition (self, subkey, value) {
	const exe = [];
	const trans = self.attr.transform;

	if (typeof value === 'function') {
		return function inner (f) {
			self[subkey](value.call(self, f));
		};
	}

	value.forEach((tV, i) => {
		let val;

		if (trans[subkey]) {
			if (trans[subkey][i] !== undefined) {
				val = trans[subkey][i];
			} else {
				val = subkey === 'scale' ? 1 : 0;
			}
		} else {
			val = subkey === 'scale' ? 1 : 0;
		}

		exe.push(coreApi_t2DGeometry.intermediateValue.bind(null, val, tV));
	});
	return function inner (f) {
		self[subkey](exe.map(d => d(f)));
	};
};

let attrTransition = function attrTransition (self, key, value) {
	let srcVal = self.attr[key]; // if (typeof value === 'function') {
	//   return function setAttr_ (f) {
	//     self.setAttr(key, value.call(self, f))
	//   }
	// }

	return function setAttr_ (f) {
		self.setAttr(key, coreApi_t2DGeometry.intermediateValue(srcVal, value, f));
	};
};

let coreApi_styleTransition = function styleTransition (self, key, value) {
	let srcValue;
	let destUnit;
	let destValue;

	if (typeof value === 'function') {
		return function inner (f) {
			self.setStyle(key, value.call(self, self.dataObj, f));
		};
	} else {
		srcValue = self.style[key];

		if (isNaN(value)) {
			if (modules_colorMap.isTypeColor(value)) {
				const colorExe = modules_colorMap.transition(srcValue, value);
				return function inner (f) {
					self.setStyle(key, colorExe(f));
				};
			}

			srcValue = srcValue.match(/(\d+)/g);
			destValue = value.match(/(\d+)/g);
			destUnit = value.match(/\D+$/);
			srcValue = parseInt(srcValue.length > 0 ? srcValue[0] : 0, 10);
			destValue = parseInt(destValue.length > 0 ? destValue[0] : 0, 10);
			destUnit = destUnit.length > 0 ? destUnit[0] : 'px';
		} else {
			srcValue = self.style[key] !== undefined ? self.style[key] : 1;
			destValue = value;
			destUnit = 0;
		}

		return function inner (f) {
			self.setStyle(key, coreApi_t2DGeometry.intermediateValue(srcValue, destValue, f) + destUnit);
		};
	}
};

const animate = function animate (self, targetConfig) {
	const tattr = targetConfig.attr ? targetConfig.attr : {};
	const tstyles = targetConfig.style ? targetConfig.style : {};
	const runStack = [];
	let value;

	if (typeof tattr !== 'function') {
		for (let key in tattr) {
			if (key !== 'transform') {
				let value = tattr[key];

				if (typeof value === 'function') {
					runStack[runStack.length] = function setAttr_ (f) {
						self.setAttr(key, value.call(self, f));
					};
				} else {
					if (key === 'd') {
						self.morphTo(targetConfig);
					} else {
						runStack[runStack.length] = attrTransition(self, key, tattr[key]);
					}
				}
			} else {
				value = tattr[key];

				if (typeof value === 'function') {
					runStack[runStack.length] = transitionSetAttr(self, key, value);
				} else {
					const trans = self.attr.transform;

					if (!trans) {
						self.attr.transform = {};
					}

					const subTrnsKeys = Object.keys(tattr.transform);

					for (let j = 0, jLen = subTrnsKeys.length; j < jLen; j += 1) {
						runStack[runStack.length] = transformTransition(self, subTrnsKeys[j], tattr.transform[subTrnsKeys[j]]);
					}
				}
			}
		}
	} else {
		runStack[runStack.length] = tattr.bind(self);
	}

	if (typeof tstyles !== 'function') {
		for (let style in tstyles) {
			runStack[runStack.length] = coreApi_styleTransition(self, style, tstyles[style]);
		}
	} else {
		runStack[runStack.length] = tstyles.bind(self);
	}

	return {
		run (f) {
			for (let j = 0, len = runStack.length; j < len; j += 1) {
				runStack[j](f);
			}
		},
		target: self,
		duration: targetConfig.duration,
		delay: targetConfig.delay ? targetConfig.delay : 0,
		end: targetConfig.end ? targetConfig.end.bind(self, self.dataObj) : null,
		loop: targetConfig.loop ? targetConfig.loop : 0,
		direction: targetConfig.direction ? targetConfig.direction : 'default',
		ease: targetConfig.ease ? targetConfig.ease : 'default'
	};
};

function performJoin (data, nodes, cond) {
	const dataIds = data.map(cond);
	const res = {
		new: [],
		update: [],
		old: []
	};

	for (let i = 0; i < nodes.length; i += 1) {
		const index = dataIds.indexOf(cond(nodes[i].dataObj, i));

		if (index !== -1) {
			nodes[i].dataObj = data[index];
			res.update.push(nodes[i]);
			dataIds[index] = null;
		} else {
			// nodes[i].dataObj = data[index]
			res.old.push(nodes[i]);
		}
	}

	res.new = data.filter((d, i) => {
		const index = dataIds.indexOf(cond(d, i));

		if (index !== -1) {
			dataIds[index] = null;
			return true;
		}

		return false;
	});
	return res;
}

let CompositeArray = {};
CompositeArray.push = {
	value: function (data) {
		if (Object.prototype.toString.call(data) !== '[object Array]') {
			data = [data];
		}

		for (let i = 0, len = data.length; i < len; i++) {
			this.data.push(data[i]);
		}

		if (this.config.action.enter) {
			let nodes = {};
			this.selector.split(',').forEach(function (d) {
				nodes[d] = data;
			});
			this.config.action.enter.call(this, nodes);
		}
	},
	enumerable: false,
	configurable: false,
	writable: false
};
CompositeArray.pop = {
	value: function () {
		let self = this;
		let elData = this.data.pop();

		if (this.config.action.exit) {
			let nodes = {};
			this.selector.split(',').forEach(function (d) {
				nodes[d] = self.fetchEls(d, [elData]);
			});
			this.config.action.exit.call(this, nodes);
		}
	},
	enumerable: false,
	configurable: false,
	writable: false
};
CompositeArray.remove = {
	value: function (data) {
		if (Object.prototype.toString.call(data) !== '[object Array]') {
			data = [data];
		}

		let self = this;

		for (let i = 0, len = data.length; i < len; i++) {
			if (this.data.indexOf(data[i]) !== -1) {
				this.data.splice(this.data.indexOf(data[i]), 1);
			}
		}

		if (this.config.action.exit) {
			let nodes = {};
			this.selector.split(',').forEach(function (d) {
				nodes[d] = self.fetchEls(d, data);
			});
			this.config.action.exit.call(this, nodes);
		}
	},
	enumerable: false,
	configurable: true,
	writable: false
};
CompositeArray.update = {
	value: function () {
		let self = this;

		if (this.config.action.update) {
			let nodes = {};
			this.selector.split(',').forEach(function (d) {
				nodes[d] = self.fetchEls(d, self.data);
			});
			this.config.action.update.call(this, nodes);
		}
	},
	enumerable: false,
	configurable: true,
	writable: false
};
CompositeArray.join = {
	value: function (data) {
		this.data = data;
		dataJoin.call(this, data, this.selector, this.config);
	},
	enumerable: false,
	configurable: true,
	writable: false
};

var NodePrototype = function () {
};

NodePrototype.prototype.getAttr = function (_) {
	return this.attr[_];
};

NodePrototype.prototype.getStyle = function (_) {
	return this.style[_];
};

NodePrototype.prototype.exec = function Cexe (exe) {
	if (typeof exe !== 'function') {
		console.error('Wrong Exe type');
	}

	exe.call(this, this.dataObj);
	return this;
};

NodePrototype.prototype.fetchEls = function (nodeSelector, dataArray) {
	const nodes = [];
	const wrap = new CollectionPrototype();

	if (this.children.length > 0) {
		if (nodeSelector.charAt(0) === '.') {
			const classToken = nodeSelector.substring(1, nodeSelector.length);
			this.children.forEach(d => {
				let check1 = dataArray && d.dataObj && dataArray.indexOf(d.dataObj) !== -1 && d.attr.class === classToken;
				let check2 = !dataArray && d.attr.class === classToken;

				if (check1 || check2) {
					nodes.push(d);
				}
			});
		} else if (nodeSelector.charAt(0) === '#') {
			const idToken = nodeSelector.substring(1, nodeSelector.length);
			this.children.every(d => {
				let check1 = dataArray && d.dataObj && dataArray.indexOf(d.dataObj) !== -1 && d.attr.id === idToken;
				let check2 = !dataArray && d.attr.id === idToken;

				if (check1 || check2) {
					nodes.push(d);
					return false;
				}

				return true;
			});
		} else {
			this.children.forEach(d => {
				let check1 = dataArray && d.dataObj && dataArray.indexOf(d.dataObj) !== -1 && d.nodeName === nodeSelector;
				let check2 = !dataArray && d.nodeName === nodeSelector;

				if (check1 || check2) {
					nodes.push(d);
				}
			});
		}
	}

	return wrap.wrapper(nodes);
};

NodePrototype.prototype.fetchEl = function (nodeSelector, data) {
	let nodes;

	if (this.children.length > 0) {
		if (nodeSelector.charAt(0) === '.') {
			const classToken = nodeSelector.substring(1, nodeSelector.length);
			this.children.every(d => {
				let check1 = data && d.dataObj && data === d.dataObj && d.attr.class === classToken;
				let check2 = !data && d.attr.class === classToken;

				if (check1 || check2) {
					nodes = d;
					return false;
				}

				return true;
			});
		} else if (nodeSelector.charAt(0) === '#') {
			const idToken = nodeSelector.substring(1, nodeSelector.length);
			this.children.every(d => {
				let check1 = data && d.dataObj && data === d.dataObj && d.attr.id === idToken;
				let check2 = !data && d.attr.id === idToken;

				if (check1 || check2) {
					nodes = d;
					return false;
				}

				return true;
			});
		} else {
			this.children.forEach(d => {
				let check1 = data && d.dataObj && data === d.dataObj && d.nodeName === nodeSelector;
				let check2 = !data && d.nodeName === nodeSelector;

				if (check1 || check2) {
					nodes = d;
				}
			});
		}
	}

	return nodes;
};

function dataJoin (data, selector, config) {
	const self = this;
	const selectors = selector.split(',');
	let {
		joinOn
	} = config;
	let joinResult = {
		new: {},
		update: {},
		old: {}
	};

	if (!joinOn) {
		joinOn = function (d, i) {
			return i;
		};
	}

	for (let i = 0, len = selectors.length; i < len; i++) {
		let d = selectors[i];
		const nodes = self.fetchEls(d);
		const join = performJoin(data, nodes.stack, joinOn);
		joinResult.new[d] = join.new;
		joinResult.update[d] = new CollectionPrototype().wrapper(join.update);
		joinResult.old[d] = new CollectionPrototype().wrapper(join.old);
	}

	if (config.action) {
		if (config.action.enter) {
			config.action.enter.call(self, joinResult.new);
		}

		if (config.action.exit) {
			config.action.exit.call(self, joinResult.old);
		}

		if (config.action.update) {
			config.action.update.call(self, joinResult.update);
		}
	}

	CompositeArray.config = {
		value: config,
		enumerable: false,
		configurable: true,
		writable: true
	};
	CompositeArray.selector = {
		value: selector,
		enumerable: false,
		configurable: true,
		writable: false
	};
	CompositeArray.data = {
		value: data,
		enumerable: false,
		configurable: true,
		writable: true
	};
	return Object.create(self, CompositeArray);
}

NodePrototype.prototype.join = dataJoin;

NodePrototype.prototype.interrupt = function () {
	if (this.animList && this.animList.length > 0) {
		for (var i = this.animList.length - 1; i >= 0; i--) {
			queueInstance.remove(this.animList[i]);
		};
	}
	this.animList = [];
	return this;
};

NodePrototype.prototype.animateTo = function (targetConfig) {
	queueInstance.add(animeId(), animate(this, targetConfig), easing(targetConfig.ease));
	return this;
};

NodePrototype.prototype.animateExe = function (targetConfig) {
	return animate(this, targetConfig);
};

function fetchEls (nodeSelector, dataArray) {
	let d;
	const coll = [];

	for (let i = 0; i < this.stack.length; i += 1) {
		d = this.stack[i];
		coll.push(d.fetchEls(nodeSelector, dataArray));
	}

	const collection = new CollectionPrototype();
	collection.wrapper(coll);
	return collection;
};

function join (data, el, arg) {
	let d;
	const coll = [];

	for (let i = 0; i < this.stack.length; i += 1) {
		d = this.stack[i];
		coll.push(d.join(data, el, arg));
	}

	const collection = new CollectionPrototype();
	collection.wrapper(coll);
	return collection;
};

function createEl (config) {
	let d;
	const coll = [];

	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		let cRes = {};
		d = this.stack[i];

		if (typeof config === 'function') {
			cRes = config.call(d, d.dataObj, i);
		} else {
			const keys = Object.keys(config);

			for (let j = 0, lenJ = keys.length; j < lenJ; j += 1) {
				const key = keys[j];

				if (typeof config[key] !== 'object') {
					cRes[key] = config[key];
				} else {
					cRes[key] = JSON.parse(JSON.stringify(config[key]));
				}
			}
		}

		coll.push(d.createEl(cRes));
	}

	const collection = new CollectionPrototype();
	collection.wrapper(coll);
	return collection;
}

function createEls (data, config) {
	let d;
	const coll = [];
	let res = data;

	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		let cRes = {};
		d = this.stack[i];

		if (typeof data === 'function') {
			res = data.call(d, d.dataObj, i);
		}

		if (typeof config === 'function') {
			cRes = config.call(d, d.dataObj, i);
		} else {
			const keys = Object.keys(config);

			for (let j = 0, lenJ = keys.length; j < lenJ; j += 1) {
				const key = keys[j];
				cRes[key] = config[key];
			}
		}

		coll.push(d.createEls(res, cRes));
	}

	const collection = new CollectionPrototype();
	collection.wrapper(coll);
	return collection;
}

function forEach (callBck) {
	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		callBck.call(this.stack[i], this.stack[i].dataObj, i);
	}

	return this;
}

function setAttribute (key, value) {
	let d;

	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		d = this.stack[i];

		if (arguments.length > 1) {
			if (typeof value === 'function') {
				d.setAttr(key, value.call(d, d.dataObj, i));
			} else {
				d.setAttr(key, value);
			}
		} else if (typeof key === 'function') {
			d.setAttr(key.call(d, d.dataObj, i));
		} else {
			const keys = Object.keys(key);

			for (let j = 0, lenJ = keys.length; j < lenJ; j += 1) {
				const keykey = keys[j];

				if (typeof key[keykey] === 'function') {
					d.setAttr(keykey, key[keykey].call(d, d.dataObj, i));
				} else {
					d.setAttr(keykey, key[keykey]);
				}
			}
		}
	}

	return this;
}

function setStyle (key, value) {
	let d;

	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		d = this.stack[i];

		if (arguments.length > 1) {
			if (typeof value === 'function') {
				d.setStyle(key, value.call(d, d.dataObj, i));
			} else {
				d.setStyle(key, value);
			}
		} else {
			if (typeof key === 'function') {
				d.setStyle(key.call(d, d.dataObj, i));
			} else {
				const keys = Object.keys(key);

				for (let j = 0, lenJ = keys.length; j < lenJ; j += 1) {
					const keykey = keys[j];

					if (typeof key[keykey] === 'function') {
						d.setStyle(keykey, key[keykey].call(d, d.dataObj, i));
					} else {
						d.setStyle(keykey, key[keykey]);
					}
				}
			}

			if (typeof key === 'function') {
				d.setStyle(key.call(d, d.dataObj, i));
			} else {
				d.setStyle(key);
			}
		}
	}

	return this;
}

function translate (value) {
	let d;

	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		d = this.stack[i];

		if (typeof value === 'function') {
			d.translate(value.call(d, d.dataObj, i));
		} else {
			d.translate(value);
		}
	}

	return this;
}

function rotate (value) {
	let d;

	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		d = this.stack[i];

		if (typeof value === 'function') {
			d.rotate(value.call(d, d.dataObj, i));
		} else {
			d.rotate(value);
		}
	}

	return this;
}

function scale (value) {
	let d;

	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		d = this.stack[i];

		if (typeof value === 'function') {
			d.scale(value.call(d, d.dataObj, i));
		} else {
			d.scale(value);
		}
	}

	return this;
}

function exec (value) {
	let d;

	if (typeof value !== 'function') {
		return;
	}

	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		d = this.stack[i];
		value.call(d, d.dataObj, i);
	}

	return this;
}

function on (eventType, hndlr) {
	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		this.stack[i].on(eventType, hndlr);
	}

	return this;
} // function in (coOr) {
//   for (let i = 0, len = this.stack.length; i < len; i += 1) {
//     this.stack[i].in(coOr)
//   }
//   return this
// }

function remove () {
	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		this.stack[i].remove();
	}

	return this;
}

function interrupt () {
	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		this.stack[i].interrupt();
	}

	return this;
}

function resolveObject (config, node, i) {
	let obj = {};
	let key;

	for (key in config) {
		if (key !== 'end') {
			if (typeof config[key] === 'function') {
				obj[key] = config[key].call(node, node.dataObj, i);
			} else {
				obj[key] = config[key];
			}
		}
	}

	return obj;
}

const animateArrayTo = function animateArrayTo (config) {
	let node;
	let newConfig;

	for (let i = 0; i < this.stack.length; i += 1) {
		newConfig = {};
		node = this.stack[i];
		newConfig = resolveObject(config, node, i);

		if (config.attr && typeof config.attr !== 'function') {
			newConfig.attr = resolveObject(config.attr, node, i);
		}

		if (config.style && typeof config.style !== 'function') {
			newConfig.style = resolveObject(config.style, node, i);
		}

		if (config.end) {
			newConfig.end = config.end;
		}

		if (config.ease) {
			newConfig.ease = config.ease;
		}

		node.animateTo(newConfig);
	}

	return this;
};

const animateArrayExe = function animateArrayExe (config) {
	let node;
	let newConfig;
	let exeArray = [];

	for (let i = 0; i < this.stack.length; i += 1) {
		newConfig = {};
		node = this.stack[i];
		newConfig = resolveObject(config, node, i);

		if (config.attr && typeof config.attr !== 'function') {
			newConfig.attr = resolveObject(config.attr, node, i);
		}

		if (config.style && typeof config.style !== 'function') {
			newConfig.style = resolveObject(config.style, node, i);
		}

		if (config.end) {
			newConfig.end = config.end;
		}

		if (config.ease) {
			newConfig.ease = config.ease;
		}

		exeArray.push(node.animateExe(newConfig));
	}

	return exeArray;
};

const animatePathArrayTo = function animatePathArrayTo (config) {
	let node;
	let keys = Object.keys(config);

	for (let i = 0, len = this.stack.length; i < len; i += 1) {
		node = this.stack[i];
		let conf = {};

		for (let j = 0; j < keys.length; j++) {
			let value = config[keys[j]];

			if (typeof value === 'function') {
				value = value.call(node, node.dataObj, i);
			}

			conf[keys[j]] = value;
		}

		node.animatePathTo(conf);
	}

	return this;
};

const textArray = function textArray (value) {
	let node;

	if (typeof value !== 'function') {
		for (let i = 0; i < this.stack.length; i += 1) {
			node = this.stack[i];
			node.text(value);
		}
	} else {
		for (let i = 0; i < this.stack.length; i += 1) {
			node = this.stack[i];
			node.text(value.call(node, node.dataObj, i));
		}
	}

	return this;
}; // function DomPattern (self, pattern, repeatInd) {
// }
// DomPattern.prototype.exe = function () {
//   return this.pattern
// }
// function createDomPattern (url, config) {
//   // new DomPattern(this, patternObj, repeatInd)
//   let patternEl = this.createEl({
//     el: 'pattern'
//   })
//   patternEl.createEl({
//     el: 'image',
//     attr: {
//       'xlink:href': url
//     }
//   })
// }
// CreateElements as CollectionPrototype

function CollectionPrototype (contextInfo, data, config, vDomIndex) {
	if (!data) {
		data = [];
	}

	let transform;
	let key;
	const attrKeys = config ? config.attr ? Object.keys(config.attr) : [] : [];
	const styleKeys = config ? config.style ? Object.keys(config.style) : [] : [];
	const bbox = config ? config['bbox'] !== undefined ? config['bbox'] : true : true;
	this.stack = data.map((d, i) => {
		let node;
		node = this.createNode(contextInfo.ctx, {
			el: config.el,
			bbox: bbox
		}, vDomIndex);

		for (let j = 0, len = attrKeys.length; j < len; j += 1) {
			key = attrKeys[j];

			if (key !== 'transform') {
				if (typeof config.attr[key] === 'function') {
					const resValue = config.attr[key].call(node, d, i);
					node.setAttr(key, resValue);
				} else {
					node.setAttr(key, config.attr[key]);
				}
			} else {
				if (typeof config.attr.transform === 'function') {
					transform = config.attr[key].call(node, d, i);
				} else {
					({
						transform
					} = config.attr);
				}

				for (const trns in transform) {
					node[trns](transform[trns]);
				}
			}
		}

		for (let j = 0, len = styleKeys.length; j < len; j += 1) {
			key = styleKeys[j];

			if (typeof config.style[key] === 'function') {
				const resValue = config.style[key].call(node, d, i);
				node.setStyle(key, resValue);
			} else {
				node.setStyle(key, config.style[key]);
			}
		}

		node.dataObj = d;
		return node;
	});
	return this;
}

CollectionPrototype.prototype = {
	createEls,
	createEl,
	forEach,
	setAttr: setAttribute,
	fetchEls,
	setStyle,
	translate,
	rotate,
	scale,
	exec,
	animateTo: animateArrayTo,
	animateExe: animateArrayExe,
	animatePathTo: animatePathArrayTo,
	remove,
	interrupt,
	text: textArray,
	join,
	on
};

CollectionPrototype.prototype.createNode = function () {
};

CollectionPrototype.prototype.wrapper = function wrapper (nodes) {
	const self = this;

	if (nodes) {
		for (let i = 0, len = nodes.length; i < len; i++) {
			let node = nodes[i];
			self.stack.push(node);
		}
	}

	return this;
};



// CONCATENATED MODULE: ./node_modules/i2djs/src/modules/webgl.js







let ratio;
const webgl_queueInstance = queue["a" /* default */];

function getPixlRatio (ctx) {
	const dpr = window.devicePixelRatio || 1;
	const bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
	return dpr / bsr;
}

let Id = 0;

function domId () {
	Id += 1;
	return Id;
}

let WebglCollection = function () {
	CollectionPrototype.apply(this, arguments);
};
WebglCollection.prototype = new CollectionPrototype();
WebglCollection.prototype.constructor = WebglCollection;
WebglCollection.prototype.createNode = function (ctx, config, vDomIndex) {
	return new WebglNodeExe(ctx, config, domId(), vDomIndex);
};

function loadShader (ctx, shaderSource, shaderType) {
	var shader = ctx.createShader(shaderType);
	ctx.shaderSource(shader, shaderSource);
	ctx.compileShader(shader);
	var compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);

	if (!compiled) {
		var lastError = ctx.getShaderInfoLog(shader);
		console.error('*** Error compiling shader \'' + shader + '\':' + lastError);
		ctx.deleteShader(shader);
		return null;
	}

	return shader;
}

function createProgram (ctx, shaders) {
	var program = ctx.createProgram();
	shaders.forEach(function (shader) {
		ctx.attachShader(program, shader);
	});
	ctx.linkProgram(program);
	var linked = ctx.getProgramParameter(program, ctx.LINK_STATUS);

	if (!linked) {
		var lastError = ctx.getProgramInfoLog(program);
		console.error('Error in program linking:' + lastError);
		ctx.deleteProgram(program);
		return null;
	}

	return program;
}

function getProgram (ctx, shaderCode) {
	var shaders = [loadShader(ctx, shaderCode.vertexShader, ctx.VERTEX_SHADER), loadShader(ctx, shaderCode.fragmentShader, ctx.FRAGMENT_SHADER)];
	return createProgram(ctx, shaders);
}

function PointNode (attr, style) {
	this.attr = attr || {};
	this.style = style || {};
};

PointNode.prototype.setShader = function (shader) {
	this.shader = shader;
	if (this.shader) {
		this.shader.addVertex(this.attr.x || 0, this.attr.y || 0, this.pindex);
		this.shader.addColors(this.style.fill || webgl_defaultColor, this.pindex);
		this.shader.addSize(this.attr.size || 0, this.pindex);
	}
};

PointNode.prototype.setAttr = function (prop, value) {
	// this.attr[prop] = value;
	if (this.shader && (prop === 'x' || prop === 'y')) {
		this.shader.updateVertex(this.pindex, this.attr.x, this.attr.y);
	}

	if (this.shader && prop === 'size') {
		this.shader.updateSize(this.pindex, this.attr.size || 0);
	}
};
PointNode.prototype.setStyle = function (key, value) {
	this.style[key] = value;
	if (this.shader && key === 'fill') {
		this.shader.updateColor(this.pindex, value);
	}
};
PointNode.prototype.getAttr = function (key) {
	return this.attr[key];
};
PointNode.prototype.getStyle = function (key) {
	return this.style[key];
};


function RectNode (attr, style) {
	this.attr = attr || {};
	this.style = style || {};
}
RectNode.prototype.setShader = function (shader) {
	this.shader = shader;
	if (this.shader) {
		this.shader.addVertex(this.attr.x || 0, this.attr.y || 0, this.attr.width || 0, this.attr.height || 0, this.pindex);
		this.shader.addColors(this.style.fill || webgl_defaultColor, this.pindex);
	}
};

RectNode.prototype.setAttr = function (key, value) {
	this.attr[key] = value;
	if (!this.shader) {
		return;
	}
	if ((key === 'x' || key === 'width')) {
		this.shader.updateVertexX(this.pindex, this.attr.x || 0, this.attr.width || 0);
	}
	if ((key === 'y' || key === 'height')) {
		this.shader.updateVertexY(this.pindex, this.attr.y || 0, this.attr.height || 0);
	}
};
RectNode.prototype.getAttr = function (key) {
	return this.attr[key];
};

RectNode.prototype.setStyle = function (key, value) {
	this.style[key] = value;
	if (this.shader && key === 'fill') {
		this.shader.updateColor(this.pindex, value);
	}
};

RectNode.prototype.getStyle = function (key) {
	return this.style[key];
};

function PolyLineNode (attr, style) {
	this.attr = attr || {};
	this.style = style || {};
}

PolyLineNode.prototype.setShader = function (shader) {
	this.shader = shader;
	if (this.shader) {
		this.shader.addVertex(this.attr.points || [], this.pindex);
		this.shader.addColors(this.style.stroke || webgl_defaultColor, this.pindex);
	}
};

PolyLineNode.prototype.setAttr = function (key, value) {
	this.attr[key] = value;
	if (this.shader && key === 'points') {
		this.shader.updateVertex(this.pindex, this.attr.points);
	}
};

PolyLineNode.prototype.getAttr = function (key) {
	return this.attr[key];
};

PolyLineNode.prototype.setStyle = function (key, value) {
	this.style[key] = value;
	if (this.shader && key === 'stroke') {
		this.shader.updateColor(this.pindex, value);
	}
};

PolyLineNode.prototype.getStyle = function (key) {
	return this.style[key];
};

function LineNode (attr, style) {
	this.attr = attr || {};
	this.style = style || {};
}

LineNode.prototype.setShader = function (shader) {
	this.shader = shader;
	if (this.shader) {
		this.shader.addVertex(this.attr.x1 || 0, this.attr.y1 || 0, this.attr.x2 || 0, this.attr.y2 || 0, this.pindex);
		this.shader.addColors(this.style.stroke || webgl_defaultColor, this.pindex);
	}
};

LineNode.prototype.setAttr = function (key, value) {
	this.attr[key] = value;
	if (this.shader && (key === 'x1' || key === 'y1' || key === 'x2' || key === 'y2')) {
		this.shader.updateVertex(this.pindex, this.attr.x1, this.attr.y1, this.attr.x2, this.attr.y2);
	}
};

LineNode.prototype.getAttr = function (key) {
	return this.attr[key];
};

LineNode.prototype.setStyle = function (key, value) {
	this.style[key] = value;
	if (this.shader && key === 'stroke') {
		this.shader.updateColor(this.pindex, value);
	}
};

LineNode.prototype.getStyle = function (key) {
	return this.style[key];
};

function polygonPointsMapper (value) {
	return earcut_default()(value.reduce(function (p, c) {
		p[p.length] = c.x;
		p[p.length] = c.y;
		return p;
	}, [])).map(function (d) {
		return value[d];
	});
}

function PolygonNode (attr, style) {
	this.attr = attr;
	this.style = style;
	this.positionArray = [];

	if (this.attr['points']) {
		this.triangulatedPoints = polygonPointsMapper(this.attr['points']);
	}
}

PolygonNode.prototype.setShader = function (shader) {
	this.shader = shader;
	if (this.shader) {
		this.shader.addVertex(this.triangulatedPoints || [], this.pindex);
		this.shader.addColors(this.style.fill || webgl_defaultColor, this.pindex);
	}
};

PolygonNode.prototype.setStyle = function (key, value) {
	this.style[key] = value;
	if (this.shader && key === 'fill') {
		this.shader.updateColors(value || webgl_defaultColor);
	}
};

PolygonNode.prototype.setAttr = function (key, value) {
	this.attr[key] = value;
	if (key === 'points') {
		this.triangulatedPoints = polygonPointsMapper(value);
		if (this.shader) {
			this.shader.updateVertex(this.triangulatedPoints || [], this.pindex);
		}
	}
};

PolygonNode.prototype.getAttr = function (key) {
	return this.attr[key];
};

PolygonNode.prototype.getStyle = function (key) {
	return this.style[key];
};

function CircleNode (attr, style) {
	this.attr = attr;
	this.style = style;
}

CircleNode.prototype.setShader = function (shader) {
	this.shader = shader;
	if (this.shader) {
		this.shader.addVertex(this.attr.cx || 0, this.attr.cy || 0, this.pindex);
		this.shader.addColors(this.style.fill || webgl_defaultColor, this.pindex);
		this.shader.addSize(this.attr.r || 0, this.pindex);
	}
};

CircleNode.prototype.setAttr = function (prop, value) {
	this.attr[prop] = value;
	if (this.shader && (prop === 'cx' || prop === 'cy')) {
		this.shader.updateVertex(this.pindex, this.attr.cx, this.attr.cy);
	}

	if (this.shader && prop === 'r') {
		this.shader.updateSize(this.pindex, this.attr.r || 0);
	}
};
CircleNode.prototype.setStyle = function (key, value) {
	this.style[key] = value;
	if (this.shader && key === 'fill') {
		this.shader.updateColor(this.pindex, value);
	}
};

CircleNode.prototype.getAttr = function (key) {
	return this.attr[key];
};

CircleNode.prototype.getStyle = function (key) {
	return this.style[key];
};

let webGLImageTextures = {};

function isPowerOf2 (value) {
	return (value & value - 1) === 0;
}

function ImageNode (ctx, attr, style, vDomIndex) {
	let self = this;
	this.ctx = ctx;
	this.attr = attr;
	this.style = style;
	this.vDomIndex = vDomIndex;
	
	if (self.attr.src && (typeof self.attr.src === 'string') && !webGLImageTextures[self.attr.src]) {
		webGLImageTextures[self.attr.src] = new TextureObject(ctx, {
			src: this.attr.src
		}, this.vDomIndex);
	}
};

ImageNode.prototype.setShader = function (shader) {
	this.shader = shader;
	if (this.shader) {
		this.shader.addVertex(this.attr.x || 0, this.attr.y || 0, this.attr.width || 0, this.attr.height || 0, this.pindex);
	}
};

ImageNode.prototype.setAttr = function (key, value) {
	this.attr[key] = value;

	if (key === 'src' && (typeof value === 'string')) {
		if (value && !webGLImageTextures[value]) {
			webGLImageTextures[value] = new TextureObject(this.ctx, {
				src: value
			}, this.vDomIndex);
		}
	}
	if (!this.shader) {
		return;
	}
	if ((key === 'x' || key === 'width')) {
		this.shader.updateVertexX(this.pindex, this.attr.x || 0, this.attr.width || 0);
	}
	if ((key === 'y' || key === 'height')) {
		this.shader.updateVertexY(this.pindex, this.attr.y || 0, this.attr.height || 0);
	}
};

ImageNode.prototype.getAttr = function (key) {
	return this.attr[key];
};

ImageNode.prototype.getStyle = function (key) {
	return this.style[key];
};


function WebglGroupNode (ctx, attr, style, renderTarget, vDomIndex) {
	// let self = this;
	this.ctx = ctx;
	this.attr = attr;
	this.style = style;
	this.renderTarget = renderTarget;
	this.vDomIndex = vDomIndex;
	if (attr.shaderType) {
		this.shader = getTypeShader(ctx, attr, style, attr.shaderType, this.renderTarget, vDomIndex);
	}
	if (this.shader && this.attr.transform) {
		if (this.attr.transform['translate']) {
			this.shader.translate(this.attr.transform['translate']);
		}
		if (this.attr.transform['scale']) {
			this.shader.scale(this.attr.transform['scale']);
		}
		if (this.attr.transform['rotate']) {
			this.shader.rotate(this.attr.transform['rotate']);
		}
	}
}

WebglGroupNode.prototype.setAttr = function (key, value) {
	this.attr[key] = value;
	if (key === 'shaderType') {
		this.shader = getTypeShader(this.ctx, this.attr, this.style, value, this.renderTarget, this.vDomIndex);
	}
	if (key === 'transform' && this.shader) {
		if (this.attr.transform['translate']) {
			this.shader.translate(this.attr.transform['translate']);
		}
		if (this.attr.transform['scale']) {
			this.shader.scale(this.attr.transform['scale']);
		}
		if (this.attr.transform['rotate']) {
			this.shader.rotate(this.attr.transform['rotate']);
		}
	}
};

WebglGroupNode.prototype.setShader = function () {

};

WebglGroupNode.prototype.getAttr = function (key) {
	return this.attr[key];
};

WebglGroupNode.prototype.getStyle = function (key) {
	return this.style[key];
};

let webgl_defaultColor = modules_colorMap.rgba(0, 0, 0, 255);

function webGlAttrMapper (ctx, program, attr, attrObj) {
	let valType = attrObj.type;
	if (!valType) {
		valType = 'FLOAT';
		if (attrObj.value instanceof Float32Array) {
			valType = 'FLOAT';
		} else if (attrObj.value instanceof Int8Array) {
			valType = 'BYTE';
		} else if (attrObj.value instanceof Int16Array) {
			valType = 'SHORT';
		} else if (attrObj.value instanceof Uint8Array) {
			valType = 'UNSIGNED_BYTE';
		} else if (attrObj.value instanceof Uint16Array) {
			valType = 'UNSIGNED_SHORT';
		}
	}
	
	return {
		bufferType: ctx['ARRAY_BUFFER'],
		buffer: ctx.createBuffer(),
		drawType: ctx['STATIC_DRAW'],
		valueType: ctx[valType],
		size: attrObj.size,
		attributeLocation: ctx.getAttribLocation(program, attr),
		value: attrObj.value,
		attr: attr
	};
}

function webGlIndexMapper (ctx, program, attrObj) {
	let valType = 'FLOAT';
	if (attrObj.value instanceof Float32Array) {
		valType = 'FLOAT';
	} else if (attrObj.value instanceof Int8Array) {
		valType = 'BYTE';
	} else if (attrObj.value instanceof Int16Array) {
		valType = 'SHORT';
	} else if (attrObj.value instanceof Uint8Array) {
		valType = 'UNSIGNED_BYTE';
	} else if (attrObj.value instanceof Uint16Array) {
		valType = 'UNSIGNED_SHORT';
	}
	
	return {
		bufferType: ctx['ELEMENT_ARRAY_BUFFER'],
		buffer: ctx.createBuffer(),
		drawType: ctx['STATIC_DRAW'],
		valueType: ctx[valType],
		value: attrObj.value,
		count: attrObj.count,
		offset: attrObj.offset
	};
}

function webGlUniformMapper (ctx, program, uniform, uniObj) {
	let type;
	let len = uniObj.size ? uniObj.size : uniObj.value.length;
	if (!uniObj.matrix) {
		if (uniObj.value instanceof TextureObject) {
			type = 'uniform1i';
		} else if (uniObj.value instanceof Float32Array) {
			type = 'uniform' + len + 'fv';
		} else if (uniObj.value instanceof Int8Array || uniObj.value instanceof Int16Array || uniObj.value instanceof Uint8Array) {
			type = 'uniform' + len + 'iv';
		} else if (!Number.isInteger(uniObj.value)) {
			type = 'uniform1f';
		} else if (Number.isInteger(uniObj.value)) {
			type = 'uniform1i';
		}
	} else {
		if (!Number.isInteger(Math.sqrt(uniObj.value.length))) {
			type = 'uniformMatrix' + Math.sqrt(uniObj.value.length) + 'fv';
		} else {
			console.error('Not Square Matrix');
		}
	}
	
	return {
		matrix: uniObj.matrix,
		transpose: uniObj.transpose,
		type: type,
		value: uniObj.value,
		uniformLocation: ctx.getUniformLocation(program, uniform)
	};
}

function RenderWebglShader (ctx, shader, vDomIndex) {
	this.ctx = ctx;
	this.dom = {};
	this.shader = shader;
	this.vDomIndex = vDomIndex;
	this.program = getProgram(ctx, shader);
	this.uniforms = {};
	this.attrObjs = {};
	this.indexesObj = null;
	this.preDraw = shader.preDraw;
	this.postDraw = shader.postDraw;
	this.geometry = shader.geometry;
	this.renderTarget = shader.renderTarget;

	for (let uniform in shader.uniforms) {
		this.uniforms[uniform] = webGlUniformMapper(ctx, this.program, uniform, shader.uniforms[uniform]);
	}

	if (this.geometry) {
		if (this.geometry instanceof MeshGeometry || this.geometry instanceof PointsGeometry || this.geometry instanceof LineGeometry) {
			this.attributes = this.geometry.attributes;
			this.indexes = this.geometry.indexes;
		} else {
			console.error('Wrong Geometry type');
		}
	}

	for (let attr in this.attributes) {
		this.attrObjs[attr] = webGlAttrMapper(ctx, this.program, attr, this.attributes[attr]);
	}

	if (this.indexes) {
		this.indexesObj = webGlIndexMapper(ctx, this.program, this.indexes);
	}
}

RenderWebglShader.prototype.useProgram = function () {
	this.ctx.useProgram(this.program);
};

RenderWebglShader.prototype.applyUniforms = function () {
	for (let uniform in this.uniforms) {
		if (this.uniforms[uniform].matrix) {
			this.ctx[this.uniforms[uniform].type](this.uniforms[uniform].uniformLocation, this.uniforms[uniform].transpose, this.uniforms[uniform].value);
		} else {
			if (this.uniforms[uniform].value instanceof TextureObject) {
				this.ctx[this.uniforms[uniform].type](this.uniforms[uniform].uniformLocation, this.uniforms[uniform].value.texture);
				this.uniforms[uniform].value.loadTexture();
			} else {
				this.ctx[this.uniforms[uniform].type](this.uniforms[uniform].uniformLocation, this.uniforms[uniform].value);
			}
		}
	}
};

RenderWebglShader.prototype.applyAttributes = function () {
	let d;
	for (let attr in this.attrObjs) {
		d = this.attrObjs[attr];
		this.ctx.bindBuffer(d.bufferType, d.buffer);
		this.ctx.bufferData(d.bufferType, this.attributes[d.attr].value, d.drawType);
		this.ctx.enableVertexAttribArray(d.attributeLocation);
		this.ctx.vertexAttribPointer(d.attributeLocation, d.size, d.valueType, true, 0, 0);
	}
};

RenderWebglShader.prototype.applyIndexes = function () {
	let d = this.indexesObj;
	this.ctx.bindBuffer(d.bufferType, d.buffer);
	this.ctx.bufferData(d.bufferType, d.value, d.drawType);
};

RenderWebglShader.prototype.draw = function () {
	this.ctx.drawArrays(this.ctx[this.geometry.drawType], this.geometry.drawRange[0], this.geometry.drawRange[1]);
};

RenderWebglShader.prototype.drawElements = function () {
	this.ctx.drawElements(this.ctx[this.geometry.drawType], this.indexesObj.count, this.indexesObj.type ? this.indexesObj.type : this.ctx.UNSIGNED_SHORT, this.indexesObj.offset);
};

RenderWebglShader.prototype.execute = function () {
	this.ctx.useProgram(this.program);
	this.applyUniforms();
	this.applyAttributes();
	// if (this.preDraw) {
	// 	this.preDraw();
	// }
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.update();
	}
	if (this.indexesObj) {
		this.applyIndexes();
		this.drawElements();
	} else {
		this.draw();
	}
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.clear();
	}
	// if (this.postDraw) {
	// 	this.postDraw();
	// }
};

RenderWebglShader.prototype.addUniform = function (key, value) {
	this.uniforms[key] = webGlUniformMapper(this.ctx, this.program, key, value);
	webgl_queueInstance.vDomChanged(this.vDomIndex);
};

RenderWebglShader.prototype.addAttribute = function (key, value) {
	this.attributes[key] = value;
	this.attrObjs[key] = webGlAttrMapper(this.ctx, this.program, key, value);
	webgl_queueInstance.vDomChanged(this.vDomIndex);
};

RenderWebglShader.prototype.setAttributeData = function (key, value) {
	this.attributes[key].value = value;
	this.attrObjs[key].value = value;
	webgl_queueInstance.vDomChanged(this.vDomIndex);
};
RenderWebglShader.prototype.applyAttributeData = function (key, value) {
	this.attributes[key].value = value;
	let d = this.attrObjs[key];
	this.ctx.bindBuffer(d.bufferType, d.buffer);
	this.ctx.bufferData(d.bufferType, this.attributes[d.attr].value, d.drawType);
	this.ctx.enableVertexAttribArray(d.attributeLocation);
	this.ctx.vertexAttribPointer(d.attributeLocation, d.size, d.valueType, true, 0, 0);
};
RenderWebglShader.prototype.setUniformData = function (key, value) {
	this.uniforms[key].value = value;
	webgl_queueInstance.vDomChanged(this.vDomIndex);
};
RenderWebglShader.prototype.applyUniformData = function (uniform, value) {
	this.uniforms[uniform].value = value;
	if (this.uniforms[uniform].matrix) {
		this.ctx[this.uniforms[uniform].type](this.uniforms[uniform].uniformLocation, this.uniforms[uniform].transpose, this.uniforms[uniform].value);
	} else {
		this.ctx[this.uniforms[uniform].type](this.uniforms[uniform].uniformLocation, this.uniforms[uniform].value);
	}
	webgl_queueInstance.vDomChanged(this.vDomIndex);
};

function ShaderNodePrototype () { }
ShaderNodePrototype.prototype.translate = function (trans) {
	this.attr.transform['translate'] = trans;
};
ShaderNodePrototype.prototype.scale = function (scale) {
	this.attr.transform['scale'] = scale;
};
ShaderNodePrototype.prototype.rotate = function (angle) {
	this.attr.transform['rotate'] = angle;
};


function RenderWebglPoints (ctx, attr, style, vDomIndex) {
	this.ctx = ctx;
	this.dom = {};
	this.attr = attr || {};
	this.style = style || {};
	this.vDomIndex = vDomIndex;

	if (!this.attr.transform) {
		this.attr.transform = {
			translate: [0.0, 0.0],
			scale: [1.0, 1.0]
		};
	}
	if (!this.attr.transform.scale) {
		this.attr.transform.scale = [1.0, 1.0];
	}
	if (!this.attr.transform.translate) {
		this.attr.transform.translate = [0.0, 0.0];
	}

	this.geometry = new PointsGeometry();
	this.geometry.setAttr('a_color', {
		value: new Float32Array([]),
		size: 4
	});
	this.geometry.setAttr('a_size', {
		value: new Float32Array([]),
		size: 1
	});
	this.geometry.setAttr('a_position', {
		value: new Float32Array([]),
		size: 2
	});

	this.shaderInstance = new RenderWebglShader(ctx, {
		fragmentShader: modules_shaders('point').fragmentShader,
		vertexShader: modules_shaders('point').vertexShader,
		uniforms: {
			u_resolution: {
				value: new Float32Array([1.0, 1.0])
			},
			u_translate: {
				value: new Float32Array(this.attr.transform.translate)
			},
			u_scale: {
				value: new Float32Array(this.attr.transform.scale)
			}
		},
		geometry: this.geometry
	}, vDomIndex);

	this.positionArray = [];
	this.colorArray = [];
	this.pointsSize = [];

	this.vertexUpdate = true;
	this.colorUpdate = true;
	this.sizeUpdate = true;
}

RenderWebglPoints.prototype = new ShaderNodePrototype();
RenderWebglPoints.prototype.constructor = RenderWebglPoints;

RenderWebglPoints.prototype.clear = function (index) {
	let colorArray = this.colorUpdate ? this.colorArray : this.typedColorArray;
	let ti = index * 4;

	colorArray[ti] = undefined;
	colorArray[ti + 1] = undefined;
	colorArray[ti + 2] = undefined;
	colorArray[ti + 3] = undefined;

	let positionArray = this.vertexUpdate ? this.positionArray : this.typedPositionArray;
	let len = index * 2;
	positionArray[len] = undefined;
	positionArray[len + 1] = undefined;

	let sizeArray = this.sizeUpdate ? this.pointsSize : this.typedSizeArray;
	sizeArray[index] = undefined;

	this.filterPositionFlag = true;
	this.filterColorFlag = true;
	this.filterSizeFlag = true;
};

RenderWebglPoints.prototype.updateVertex = function (index, x, y) {
	let positionArray = this.vertexUpdate ? this.positionArray : this.typedPositionArray;
	positionArray[index * 2] = x;
	positionArray[(index * 2) + 1] = y;
};

RenderWebglPoints.prototype.updateSize = function (index, size) {
	let sizeArray = this.sizeUpdate ? this.pointsSize : this.typedSizeArray;
	sizeArray[index] = size;
};

RenderWebglPoints.prototype.updateColor = function (index, fill) {
	let colorArray = this.colorUpdate ? this.colorArray : this.typedColorArray;
	colorArray[index * 4] = fill.r / 255;
	colorArray[(index * 4) + 1] = fill.g / 255;
	colorArray[(index * 4) + 2] = fill.b / 255;
	colorArray[(index * 4) + 3] = fill.a === undefined ? 1 : fill.a / 255;
};

RenderWebglPoints.prototype.addVertex = function (x, y, index) {
	this.positionArray = (this.typedPositionArray && this.typedPositionArray.length > 0) ? Array.from(this.typedPositionArray) : this.positionArray;
	this.positionArray[index * 2] = x;
	this.positionArray[(index * 2) + 1] = y;
	this.vertexUpdate = true;
};

RenderWebglPoints.prototype.addSize = function (size, index) {
	this.pointsSize = (this.typedSizeArray && this.typedSizeArray.length > 0) ? Array.from(this.typedSizeArray) : this.pointsSize;
	this.pointsSize[index] = size;
	this.sizeUpdate = true;
};

RenderWebglPoints.prototype.addColors = function (fill, index) {
	this.colorArray = (this.typedColorArray && this.typedColorArray.length > 0) ? Array.from(this.typedColorArray) : this.colorArray;
	this.colorArray[index * 4] = fill.r / 255;
	this.colorArray[(index * 4) + 1] = fill.g / 255;
	this.colorArray[(index * 4) + 2] = fill.b / 255;
	this.colorArray[(index * 4) + 3] = fill.a === undefined ? 1 : fill.a / 255;
	this.colorUpdate = true;
};

RenderWebglPoints.prototype.execute = function (stack) {
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.update();
	}

	if (this.vertexUpdate) {
		if (this.filterPositionFlag) {
			this.positionArray = this.positionArray.filter(function (d) {
				return !isNaN(d);
			});
			this.filterPositionFlag = false;
		}
		this.typedPositionArray = new Float32Array(this.positionArray);
		this.positionArray = [];
		this.vertexUpdate = false;
	}
	if (this.colorUpdate) {
		if (this.filterColorFlag) {
			this.colorArray = this.colorArray.filter(function (d) {
				return !isNaN(d);
			});
			this.filterColorFlag = false;
		}
		this.typedColorArray = new Float32Array(this.colorArray);
		this.colorArray = [];
		this.colorUpdate = false;
	}
	if (this.sizeUpdate) {
		if (this.filterSizeFlag) {
			this.pointsSize = this.pointsSize.filter(function (d) {
				return !isNaN(d);
			});
			this.filterSizeFlag = false;
		}
		this.typedSizeArray = new Float32Array(this.pointsSize);
		this.pointsSize = [];
		this.sizeUpdate = false;
	}
	if (this.filterPositionFlag) {
		this.typedPositionArray = this.typedPositionArray.filter(function (d) {
			return !isNaN(d);
		});
		this.filterPositionFlag = false;
	}
	if (this.filterColorFlag) {
		this.typedColorArray = this.typedColorArray.filter(function (d) {
			return !isNaN(d);
		});
		this.filterColorFlag = false;
	}
	if (this.filterSizeFlag) {
		this.typedSizeArray = this.typedSizeArray.filter(function (d) {
			return !isNaN(d);
		});
		this.filterSizeFlag = false;
	}
	this.shaderInstance.setUniformData('u_resolution', new Float32Array([this.ctx.canvas.width / ratio, this.ctx.canvas.height / ratio]));
	this.shaderInstance.setUniformData('u_scale', new Float32Array([this.attr.transform.scale[0], this.attr.transform.scale[1]]));
	this.shaderInstance.setUniformData('u_translate', new Float32Array([this.attr.transform.translate[0], this.attr.transform.translate[1]]));
	this.shaderInstance.setAttributeData('a_color', this.typedColorArray);
	this.shaderInstance.setAttributeData('a_size', this.typedSizeArray);
	this.shaderInstance.setAttributeData('a_position', this.typedPositionArray);
	this.geometry.setDrawRange(0, this.typedPositionArray.length / 2);

	this.shaderInstance.execute();
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.update();
	}
};

function RenderWebglRects (ctx, attr, style, renderTarget, vDomIndex) {
	this.ctx = ctx;
	this.dom = {};
	this.positionArray = [];
	this.colorArray = [];
	this.attr = attr || {};
	this.style = style || {};
	this.vDomIndex = vDomIndex;
	this.renderTarget = renderTarget;

	if (!this.attr.transform) {
		this.attr.transform = {
			translate: [0.0, 0.0],
			scale: [1.0, 1.0]
		};
	}

	this.geometry = new MeshGeometry();
	this.geometry.setAttr('a_color', {
		value: new Float32Array(this.colorArray),
		size: 4
	});
	this.geometry.setAttr('a_position', {
		value: new Float32Array(this.positionArray),
		size: 2
	});
	this.geometry.setDrawRange(0, this.positionArray.length / 2);

	this.shaderInstance = new RenderWebglShader(ctx, {
		fragmentShader: modules_shaders('rect').fragmentShader,
		vertexShader: modules_shaders('rect').vertexShader,
		uniforms: {
			u_resolution: {
				value: new Float32Array([1.0, 1.0])
			},
			u_translate: {
				value: new Float32Array(this.attr.transform.translate)
			},
			u_scale: {
				value: new Float32Array(this.attr.transform.scale)
			}
		},
		geometry: this.geometry
	}, vDomIndex);

	this.vertexUpdate = true;
	this.colorUpdate = true;
};

RenderWebglRects.prototype = new ShaderNodePrototype();
RenderWebglRects.prototype.constructor = RenderWebglRects;

RenderWebglRects.prototype.clear = function (index) {
	let colorArray = this.colorUpdate ? this.colorArray : this.typedColorArray;
	let ti = index * 24;

	colorArray[ti] = colorArray[ti + 4] = colorArray[ti + 8] = colorArray[ti + 12] = colorArray[ti + 16] = colorArray[ti + 20] = undefined;
	colorArray[ti + 1] = colorArray[ti + 5] = colorArray[ti + 9] = colorArray[ti + 13] = colorArray[ti + 17] = colorArray[ti + 21] = undefined;
	colorArray[ti + 2] = colorArray[ti + 6] = colorArray[ti + 10] = colorArray[ti + 14] = colorArray[ti + 18] = colorArray[ti + 22] = undefined;
	colorArray[ti + 3] = colorArray[ti + 7] = colorArray[ti + 11] = colorArray[ti + 15] = colorArray[ti + 19] = colorArray[ti + 23] = undefined;

	let positionArray = this.vertexUpdate ? this.positionArray : this.typedPositionArray;
	let len = index * 12;
	positionArray[len] = positionArray[len + 4] = positionArray[len + 6] = undefined;
	positionArray[len + 2] = positionArray[len + 8] = positionArray[len + 10] = undefined;
	positionArray[len + 1] = positionArray[len + 3] = positionArray[len + 9] = undefined;
	positionArray[len + 5] = positionArray[len + 7] = positionArray[len + 11] = undefined;

	this.filterPositionFlag = true;
	this.filterColorFlag = true;
};

RenderWebglRects.prototype.updateVertexX = function (index, x, width) {
	let positionArray = this.vertexUpdate ? this.positionArray : this.typedPositionArray;
	let len = index * 12;
	let x1 = x + width;
	if (isNaN(positionArray[len])) {
		console.log('overriding Nan');
	}
	positionArray[len] = positionArray[len + 4] = positionArray[len + 6] = x;
	positionArray[len + 2] = positionArray[len + 8] = positionArray[len + 10] = x1;
};

RenderWebglRects.prototype.updateVertexY = function (index, y, height) {
	let positionArray = this.vertexUpdate ? this.positionArray : this.typedPositionArray;
	let len = index * 12;
	let y1 = y + height;
	positionArray[len + 1] = positionArray[len + 3] = positionArray[len + 9] = y;
	positionArray[len + 5] = positionArray[len + 7] = positionArray[len + 11] = y1;
};

RenderWebglRects.prototype.updateColor = function (index, fill) {
	let colorArray = this.colorUpdate ? this.colorArray : this.typedColorArray;
	let ti = index * 24;
	if (isNaN(colorArray[ti])) {
		console.log('overriding Nan');
	}
	colorArray[ti] = colorArray[ti + 4] = colorArray[ti + 8] = colorArray[ti + 12] = colorArray[ti + 16] = colorArray[ti + 20] = fill.r / 255;
	colorArray[ti + 1] = colorArray[ti + 5] = colorArray[ti + 9] = colorArray[ti + 13] = colorArray[ti + 17] = colorArray[ti + 21] = fill.g / 255;
	colorArray[ti + 2] = colorArray[ti + 6] = colorArray[ti + 10] = colorArray[ti + 14] = colorArray[ti + 18] = colorArray[ti + 22] = fill.b / 255;
	colorArray[ti + 3] = colorArray[ti + 7] = colorArray[ti + 11] = colorArray[ti + 15] = colorArray[ti + 19] = colorArray[ti + 23] = fill.a === undefined ? 1 : fill.a / 255;
};

RenderWebglRects.prototype.addVertex = function (x, y, width, height, index) {
	this.positionArray = (this.typedPositionArray && this.typedPositionArray.length > 0) ? Array.from(this.typedPositionArray) : this.positionArray;
	this.typedPositionArray = null;
	let len = index * 12;
	let x1 = x + width;
	let y1 = y + height;

	this.positionArray[len] = this.positionArray[len + 4] = this.positionArray[len + 6] = x;
	this.positionArray[len + 1] = this.positionArray[len + 3] = this.positionArray[len + 9] = y;
	this.positionArray[len + 2] = this.positionArray[len + 8] = this.positionArray[len + 10] = x1;
	this.positionArray[len + 5] = this.positionArray[len + 7] = this.positionArray[len + 11] = y1;
	this.vertexUpdate = true;
};

RenderWebglRects.prototype.addColors = function (fill, index) {
	this.colorArray = (this.typedColorArray && this.typedColorArray.length > 0) ? Array.from(this.typedColorArray) : this.colorArray;
	this.typedColorArray = null;
	let ti = index * 24;
	this.colorArray[ti] = this.colorArray[ti + 4] = this.colorArray[ti + 8] = this.colorArray[ti + 12] = this.colorArray[ti + 16] = this.colorArray[ti + 20] = fill.r / 255;
	this.colorArray[ti + 1] = this.colorArray[ti + 5] = this.colorArray[ti + 9] = this.colorArray[ti + 13] = this.colorArray[ti + 17] = this.colorArray[ti + 21] = fill.g / 255;
	this.colorArray[ti + 2] = this.colorArray[ti + 6] = this.colorArray[ti + 10] = this.colorArray[ti + 14] = this.colorArray[ti + 18] = this.colorArray[ti + 22] = fill.b / 255;
	this.colorArray[ti + 3] = this.colorArray[ti + 7] = this.colorArray[ti + 11] = this.colorArray[ti + 15] = this.colorArray[ti + 19] = this.colorArray[ti + 23] = fill.a === undefined ? 1 : fill.a / 255;
	this.colorUpdate = true;
};

RenderWebglRects.prototype.execute = function (stack) {
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.update();
	}
	if (this.vertexUpdate) {
		if (this.filterPositionFlag) {
			this.positionArray = this.positionArray.filter(function (d) {
				return !isNaN(d);
			});
			this.filterPositionFlag = false;
		}
		this.typedPositionArray = new Float32Array(this.positionArray);
		this.positionArray = [];
		this.vertexUpdate = false;
	}
	if (this.colorUpdate) {
		if (this.filterColorFlag) {
			this.colorArray = this.colorArray.filter(function (d) {
				return !isNaN(d);
			});
			this.filterColorFlag = false;
		}
		this.typedColorArray = new Float32Array(this.colorArray);
		this.colorArray = [];
		this.colorUpdate = false;
	}
	if (this.filterPositionFlag) {
		this.typedPositionArray = this.typedPositionArray.filter(function (d) {
			return !isNaN(d);
		});
		this.filterPositionFlag = false;
	}
	if (this.filterColorFlag) {
		this.typedColorArray = this.typedColorArray.filter(function (d) {
			return !isNaN(d);
		});
		this.filterColorFlag = false;
	}
	this.shaderInstance.setAttributeData('a_color', this.typedColorArray);
	this.shaderInstance.setAttributeData('a_position', this.typedPositionArray);
	this.geometry.setDrawRange(0, this.typedPositionArray.length / 2);
	this.shaderInstance.setUniformData('u_resolution', new Float32Array([this.ctx.canvas.width / ratio, this.ctx.canvas.height / ratio]));
	this.shaderInstance.setUniformData('u_scale', new Float32Array([this.attr.transform.scale[0], this.attr.transform.scale[1]]));
	this.shaderInstance.setUniformData('u_translate', new Float32Array([this.attr.transform.translate[0], this.attr.transform.translate[1]]));
	this.shaderInstance.execute();
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.clear();
	}
};

function RenderWebglLines (ctx, attr, style, renderTarget, vDomIndex) {
	this.ctx = ctx;
	this.dom = {};
	this.attr = attr || {};
	this.style = style || {};
	this.vDomIndex = vDomIndex;
	this.positionArray = [];
	this.colorArray = [];
	this.vertexUpdate = true;
	this.colorUpdate = true;
	this.renderTarget = renderTarget;

	if (!this.attr.transform) {
		this.attr.transform = {
			translate: [0.0, 0.0],
			scale: [1.0, 1.0]
		};
	}

	this.geometry = new LineGeometry();
	this.geometry.setAttr('a_color', {
		value: new Float32Array(this.colorArray),
		size: 4
	});
	this.geometry.setAttr('a_position', {
		value: new Float32Array(this.positionArray),
		size: 2
	});
	this.geometry.setDrawRange(0, this.positionArray.length / 2);

	this.shaderInstance = new RenderWebglShader(ctx, {
		fragmentShader: modules_shaders('line').fragmentShader,
		vertexShader: modules_shaders('line').vertexShader,
		uniforms: {
			u_resolution: {
				value: new Float32Array([1.0, 1.0])
			},
			u_translate: {
				value: new Float32Array(this.attr.transform.translate)
			},
			u_scale: {
				value: new Float32Array(this.attr.transform.scale)
			}
		},
		geometry: this.geometry
	}, vDomIndex);
}

RenderWebglLines.prototype = new ShaderNodePrototype();
RenderWebglLines.prototype.constructor = RenderWebglLines;

RenderWebglLines.prototype.clear = function (index) {
	let colorArray = this.colorUpdate ? this.colorArray : this.typedColorArray;
	let ti = index * 8;

	colorArray[ti] = undefined;
	colorArray[ti + 1] = undefined;
	colorArray[ti + 2] = undefined;
	colorArray[ti + 3] = undefined;
	colorArray[ti + 4] = undefined;
	colorArray[ti + 5] = undefined;
	colorArray[ti + 6] = undefined;
	colorArray[ti + 7] = undefined;

	let positionArray = this.vertexUpdate ? this.positionArray : this.typedPositionArray;
	let len = index * 4;
	positionArray[len] = undefined;
	positionArray[len + 1] = undefined;
	positionArray[len + 2] = undefined;
	positionArray[len + 3] = undefined;

	this.filterPositionFlag = true;
	this.filterColorFlag = true;
};

RenderWebglLines.prototype.updateVertex = function (index, x1, y1, x2, y2) {
	let positionArray = this.vertexUpdate ? this.positionArray : this.typedPositionArray;
	let len = index * 4;
	positionArray[len] = x1;
	positionArray[len + 1] = y1;
	positionArray[len + 2] = x2;
	positionArray[len + 3] = y2;
};

RenderWebglLines.prototype.updateColor = function (i, stroke) {
	let colorArray = this.vertexUpdate ? this.colorArray : this.typedColorArray;
	colorArray[i * 8] = stroke.r / 255;
	colorArray[(i * 8) + 1] = stroke.g / 255;
	colorArray[(i * 8) + 2] = stroke.b / 255;
	colorArray[(i * 8) + 3] = stroke.a === undefined ? 1 : stroke.a / 255;
	colorArray[(i * 8) + 4] = stroke.r / 255;
	colorArray[(i * 8) + 5] = stroke.g / 255;
	colorArray[(i * 8) + 6] = stroke.b / 255;
	colorArray[(i * 8) + 7] = stroke.a === undefined ? 1 : stroke.a / 255;
};

RenderWebglLines.prototype.addVertex = function (x1, y1, x2, y2, index) {
	this.positionArray = (this.typedPositionArray && this.typedPositionArray.length > 0) ? Array.from(this.typedPositionArray) : this.positionArray;
	this.positionArray[index * 4] = x1;
	this.positionArray[(index * 4) + 1] = y1;
	this.positionArray[(index * 4) + 2] = x2;
	this.positionArray[(index * 4) + 3] = y2;
	this.vertexUpdate = true;
};

RenderWebglLines.prototype.addColors = function (stroke, index) {
	this.colorArray = (this.typedColorArray && this.typedColorArray.length > 0) ? Array.from(this.typedColorArray) : this.colorArray;
	this.colorArray[index * 8] = stroke.r / 255;
	this.colorArray[(index * 8) + 1] = stroke.g / 255;
	this.colorArray[(index * 8) + 2] = stroke.b / 255;
	this.colorArray[(index * 8) + 3] = stroke.a === undefined ? 1 : stroke.a / 255;
	this.colorArray[(index * 8) + 4] = stroke.r / 255;
	this.colorArray[(index * 8) + 5] = stroke.g / 255;
	this.colorArray[(index * 8) + 6] = stroke.b / 255;
	this.colorArray[(index * 8) + 7] = stroke.a === undefined ? 1 : stroke.a / 255;
	this.colorUpdate = true;
};

RenderWebglLines.prototype.execute = function (stack) {
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.update();
	}
	if (this.vertexUpdate) {
		if (this.filterPositionFlag) {
			this.positionArray = this.positionArray.filter(function (d) {
				return !isNaN(d);
			});
			this.filterPositionFlag = false;
		}
		this.typedPositionArray = new Float32Array(this.positionArray);
		this.positionArray = [];
		this.vertexUpdate = false;
	}
	if (this.colorUpdate) {
		if (this.filterColorFlag) {
			this.colorArray = this.colorArray.filter(function (d) {
				return !isNaN(d);
			});
			this.filterColorFlag = false;
		}
		this.typedColorArray = new Float32Array(this.colorArray);
		this.colorArray = [];
		this.colorUpdate = false;
	}
	if (this.filterPositionFlag) {
		this.typedPositionArray = this.typedPositionArray.filter(function (d) {
			return !isNaN(d);
		});
		this.filterPositionFlag = false;
	}
	if (this.filterColorFlag) {
		this.typedColorArray = this.typedColorArray.filter(function (d) {
			return !isNaN(d);
		});
		this.filterColorFlag = false;
	}

	this.shaderInstance.setAttributeData('a_color', this.typedColorArray);
	this.shaderInstance.setAttributeData('a_position', this.typedPositionArray);
	this.geometry.setDrawRange(0, this.typedPositionArray.length / 2);
	this.shaderInstance.setUniformData('u_resolution', new Float32Array([this.ctx.canvas.width / ratio, this.ctx.canvas.height / ratio]));
	this.shaderInstance.setUniformData('u_scale', new Float32Array([this.attr.transform.scale[0], this.attr.transform.scale[1]]));
	this.shaderInstance.setUniformData('u_translate', new Float32Array([this.attr.transform.translate[0], this.attr.transform.translate[1]]));
	this.shaderInstance.execute();
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.clear();
	}
};

function RenderWebglPolyLines (ctx, attr, style, renderTarget, vDomIndex) {
	this.ctx = ctx;
	this.dom = {};
	this.attr = attr || {};
	this.style = style || {};
	this.vDomIndex = vDomIndex;
	this.positionArray = [];
	this.colorArray = [];
	this.renderTarget = renderTarget;

	if (!this.attr.transform) {
		this.attr.transform = {
			translate: [0.0, 0.0],
			scale: [1.0, 1.0]
		};
	}

	this.geometry = new LineGeometry();
	this.geometry.drawType = 'LINE_STRIP';
	this.geometry.setAttr('a_position', {
		value: new Float32Array(this.positionArray),
		size: 2
	});
	this.geometry.setDrawRange(0, this.positionArray.length / 2);

	this.shaderInstance = new RenderWebglShader(ctx, {
		fragmentShader: modules_shaders('polyline').fragmentShader,
		vertexShader: modules_shaders('polyline').vertexShader,
		uniforms: {
			u_resolution: {
				value: new Float32Array([1.0, 1.0])
			},
			u_translate: {
				value: new Float32Array(this.attr.transform.translate)
			},
			u_scale: {
				value: new Float32Array(this.attr.transform.scale)
			},
			u_color: {
				value: new Float32Array(4)
			}
		},
		geometry: this.geometry
	}, vDomIndex);
}

RenderWebglPolyLines.prototype = new ShaderNodePrototype();
RenderWebglPolyLines.prototype.constructor = RenderWebglPolyLines;

RenderWebglPolyLines.prototype.clear = function (index) {
	this.positionArray[index] = undefined;
	this.colorArray[index] = undefined;
	this.filterColorFlag = true;
	this.filterPositionFlag = true;
};

RenderWebglPolyLines.prototype.updateVertex = function (index, points) {
	let subPoints = [];
	for (let j = 0, jlen = points.length; j < jlen; j++) {
		subPoints[j * 2] = points[j].x;
		subPoints[(j * 2) + 1] = points[j].y;
	}
	this.positionArray[index] = new Float32Array(subPoints);
};

RenderWebglPolyLines.prototype.updateColor = function (index, fill) {
	this.colorArray[index] = new Float32Array([fill.r / 255, fill.g / 255, fill.b / 255, fill.a === undefined ? 1 : fill.a / 255]);
};

RenderWebglPolyLines.prototype.addVertex = function (points, index) {
	let positionArray = this.positionArray;
	let subPoints = [];

	for (let j = 0, jlen = points.length; j < jlen; j++) {
		subPoints[j * 2] = points[j].x;
		subPoints[(j * 2) + 1] = points[j].y;
	}

	positionArray[index] = new Float32Array(subPoints);
	this.vertexUpdate = true;
};

RenderWebglPolyLines.prototype.addColors = function (fill, index) {
	this.colorArray[index] = new Float32Array([fill.r / 255, fill.g / 255, fill.b / 255, fill.a === undefined ? 1 : fill.a / 255]);
	this.colorUpdate = true;
};

RenderWebglPolyLines.prototype.execute = function (stack) {
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.update();
	}

	if (!this.attr.transform.scale) {
		this.attr.transform.scale = [1.0, 1.0];
	}

	if (!this.attr.transform.translate) {
		this.attr.transform.translate = [0.0, 0.0];
	}

	if (this.filterPositionFlag) {
		this.positionArray = this.positionArray.filter(function (d) {
			return d;
		});
		this.filterPositionFlag = false;
	}
	if (this.filterColorFlag) {
		this.colorArray = this.colorArray.filter(function (d) {
			return d;
		});
		this.filterColorFlag = false;
	}

	this.shaderInstance.setUniformData('u_resolution', new Float32Array([this.ctx.canvas.width / ratio, this.ctx.canvas.height / ratio]));
	this.shaderInstance.setUniformData('u_scale', new Float32Array([this.attr.transform.scale[0], this.attr.transform.scale[1]]));
	this.shaderInstance.setUniformData('u_translate', new Float32Array([this.attr.transform.translate[0], this.attr.transform.translate[1]]));

	for (let i = 0, len = this.positionArray.length; i < len; i++) {
		// this.shaderInstance.setAttributeData('a_color', this.colorArray[i]);
		this.shaderInstance.setAttributeData('a_position', this.positionArray[i]);
		this.shaderInstance.setUniformData('u_color', this.colorArray[i]);
		this.geometry.setDrawRange(0, this.positionArray[i].length / 2);
		this.shaderInstance.execute();
	}
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.clear();
	}
};

function RenderWebglPolygons (ctx, attr, style, renderTarget, vDomIndex) {
	this.ctx = ctx;
	this.dom = {};
	this.attr = attr || {};
	this.style = style || {};
	this.vDomIndex = vDomIndex;
	this.colorArray = [];
	this.positionArray = [];
	this.renderTarget = renderTarget;

	if (!this.attr.transform) {
		this.attr.transform = {
			translate: [0.0, 0.0],
			scale: [1.0, 1.0]
		};
	}

	this.geometry = new MeshGeometry();

	this.geometry.setAttr('a_position', {
		value: new Float32Array([]),
		size: 2
	});

	this.shaderInstance = new RenderWebglShader(ctx, {
		fragmentShader: modules_shaders('polygon').fragmentShader,
		vertexShader: modules_shaders('polygon').vertexShader,
		uniforms: {
			u_resolution: {
				value: new Float32Array([1.0, 1.0])
			},
			u_translate: {
				value: new Float32Array(this.attr.transform.translate)
			},
			u_scale: {
				value: new Float32Array(this.attr.transform.scale)
			},
			u_color: {
				value: new Float32Array(4)
			}
		},
		geometry: this.geometry
	}, vDomIndex);
}

RenderWebglPolygons.prototype = new ShaderNodePrototype();
RenderWebglPolygons.prototype.constructor = RenderWebglPolygons;

RenderWebglPolygons.prototype.clear = function (index) {
	this.positionArray[index] = undefined;
	this.colorArray[index] = undefined;
	this.filterColorFlag = true;
	this.filterPositionFlag = true;
};

RenderWebglPolygons.prototype.updateVertex = function (index, points) {
	let subPoints = [];
	for (let j = 0, jlen = points.length; j < jlen; j++) {
		subPoints[j * 2] = points[j].x;
		subPoints[(j * 2) + 1] = points[j].y;
	}
	this.positionArray[index] = new Float32Array(subPoints);
};

RenderWebglPolygons.prototype.updateColor = function (index, fill) {
	this.colorArray[index] = new Float32Array([fill.r / 255, fill.g / 255, fill.b / 255, fill.a === undefined ? 1 : fill.a / 255]);
};

RenderWebglPolygons.prototype.addVertex = function (points, index) {
	let positionArray = this.positionArray;
	let subPoints = [];

	for (let j = 0, jlen = points.length; j < jlen; j++) {
		subPoints[j * 2] = points[j].x;
		subPoints[(j * 2) + 1] = points[j].y;
	}

	positionArray[index] = new Float32Array(subPoints);
	this.vertexUpdate = true;
};

RenderWebglPolygons.prototype.addColors = function (fill, index) {
	this.colorArray[index] = new Float32Array([fill.r / 255, fill.g / 255, fill.b / 255, fill.a === undefined ? 1 : fill.a / 255]);
	this.colorUpdate = true;
};

RenderWebglPolygons.prototype.execute = function (stack) {
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.update();
	}

	if (!this.attr.transform.scale) {
		this.attr.transform.scale = [1.0, 1.0];
	}

	if (!this.attr.transform.translate) {
		this.attr.transform.translate = [0.0, 0.0];
	}

	if (this.filterPositionFlag) {
		this.positionArray = this.positionArray.filter(function (d) {
			return d;
		});
		this.filterPositionFlag = false;
	}
	if (this.filterColorFlag) {
		this.colorArray = this.colorArray.filter(function (d) {
			return d;
		});
		this.filterColorFlag = false;
	}

	this.shaderInstance.useProgram();
	this.shaderInstance.applyUniformData('u_resolution', new Float32Array([this.ctx.canvas.width / ratio, this.ctx.canvas.height / ratio]));
	this.shaderInstance.applyUniformData('u_scale', new Float32Array([this.attr.transform.scale[0], this.attr.transform.scale[1]]));
	this.shaderInstance.applyUniformData('u_translate', new Float32Array([this.attr.transform.translate[0], this.attr.transform.translate[1]]));

	for (let i = 0, len = this.positionArray.length; i < len; i++) {
		this.shaderInstance.setUniformData('u_color', this.colorArray[i]);
		this.shaderInstance.setAttributeData('a_position', this.positionArray[i]);
		this.geometry.setDrawRange(0, this.positionArray[i].length / 2);
		this.shaderInstance.execute();
	}
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.clear();
	}
};

function RenderWebglCircles (ctx, attr, style, renderTarget, vDomIndex) {
	this.ctx = ctx;
	this.dom = {};
	this.attr = attr || {};
	this.style = style || {};
	this.vDomIndex = vDomIndex;
	this.positionArray = [];
	this.colorArray = [];
	this.pointsSize = [];
	this.renderTarget = renderTarget;

	if (!this.attr.transform) {
		this.attr.transform = {
			translate: [0.0, 0.0],
			scale: [1.0, 1.0]
		};
	}

	this.geometry = new PointsGeometry();
	this.geometry.setAttr('a_color', {
		value: new Float32Array(this.colorArray),
		size: 4
	});
	this.geometry.setAttr('a_radius', {
		value: new Float32Array(this.pointsSize),
		size: 1
	});
	this.geometry.setAttr('a_position', {
		value: new Float32Array(this.positionArray),
		size: 2
	});
	this.geometry.setDrawRange(0, 0);

	this.shaderInstance = new RenderWebglShader(ctx, {
		fragmentShader: modules_shaders('circle').fragmentShader,
		vertexShader: modules_shaders('circle').vertexShader,
		uniforms: {
			u_resolution: {
				value: new Float32Array([1.0, 1.0])
			},
			u_translate: {
				value: new Float32Array(this.attr.transform.translate)
			},
			u_scale: {
				value: new Float32Array(this.attr.transform.scale)
			}
		},
		geometry: this.geometry
	}, vDomIndex);

	this.vertexUpdate = true;
	this.colorUpdate = true;
	this.sizeUpdate = true;
};

RenderWebglCircles.prototype = new ShaderNodePrototype();
RenderWebglCircles.prototype.constructor = RenderWebglCircles;

RenderWebglCircles.prototype.clear = function (index) {
	let colorArray = this.colorUpdate ? this.colorArray : this.typedColorArray;
	let ti = index * 4;

	colorArray[ti] = undefined;
	colorArray[ti + 1] = undefined;
	colorArray[ti + 2] = undefined;
	colorArray[ti + 3] = undefined;

	let positionArray = this.vertexUpdate ? this.positionArray : this.typedPositionArray;
	let len = index * 2;
	positionArray[len] = undefined;
	positionArray[len + 1] = undefined;

	let sizeArray = this.sizeUpdate ? this.pointsSize : this.typedSizeArray;
	sizeArray[index] = undefined;

	this.filterPositionFlag = true;
	this.filterColorFlag = true;
	this.filterSizeFlag = true;
};

RenderWebglCircles.prototype.updateVertex = function (index, x, y) {
	let positionArray = this.vertexUpdate ? this.positionArray : this.typedPositionArray;
	positionArray[index * 2] = x;
	positionArray[(index * 2) + 1] = y;
};

RenderWebglCircles.prototype.updateColor = function (index, fill) {
	let colorArray = this.colorUpdate ? this.colorArray : this.typedColorArray;
	colorArray[index * 4] = fill.r / 255;
	colorArray[(index * 4) + 1] = fill.g / 255;
	colorArray[(index * 4) + 2] = fill.b / 255;
	colorArray[(index * 4) + 3] = fill.a === undefined ? 1 : fill.a / 255;
};

RenderWebglCircles.prototype.updateSize = function (index, value) {
	let sizeArray = this.sizeUpdate ? this.pointsSize : this.typedSizeArray;
	sizeArray[index] = value;
};

RenderWebglCircles.prototype.addVertex = function (x, y, index) {
	this.positionArray = (this.typedPositionArray && this.typedPositionArray.length > 0) ? Array.from(this.typedPositionArray) : this.positionArray;
	this.positionArray[index * 2] = x;
	this.positionArray[(index * 2) + 1] = y;
	this.vertexUpdate = true;
};

RenderWebglCircles.prototype.addSize = function (size, index) {
	this.pointsSize = (this.typedSizeArray && this.typedSizeArray.length > 0) ? Array.from(this.typedSizeArray) : this.pointsSize;
	this.pointsSize[index] = size;
	this.sizeUpdate = true;
};

RenderWebglCircles.prototype.addColors = function (fill, index) {
	this.colorArray = (this.typedColorArray && this.typedColorArray.length > 0) ? Array.from(this.typedColorArray) : this.colorArray;
	this.colorArray[index * 4] = fill.r / 255;
	this.colorArray[(index * 4) + 1] = fill.g / 255;
	this.colorArray[(index * 4) + 2] = fill.b / 255;
	this.colorArray[(index * 4) + 3] = fill.a === undefined ? 1 : fill.a / 255;
	this.colorUpdate = true;
};

RenderWebglCircles.prototype.execute = function (stack) {
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.update();
	}

	if (!this.attr.transform.scale) {
		this.attr.transform.scale = [1.0, 1.0];
	}

	if (!this.attr.transform.translate) {
		this.attr.transform.translate = [0.0, 0.0];
	}

	if (this.vertexUpdate) {
		if (this.filterPositionFlag) {
			this.positionArray = this.positionArray.filter(function (d) {
				return !isNaN(d);
			});
			this.filterPositionFlag = false;
		}
		this.typedPositionArray = new Float32Array(this.positionArray);
		this.positionArray = [];
		this.vertexUpdate = false;
	}
	if (this.colorUpdate) {
		if (this.filterColorFlag) {
			this.colorArray = this.colorArray.filter(function (d) {
				return !isNaN(d);
			});
			this.filterColorFlag = false;
		}
		this.typedColorArray = new Float32Array(this.colorArray);
		this.colorArray = [];
		this.colorUpdate = false;
	}
	if (this.sizeUpdate) {
		if (this.filterSizeFlag) {
			this.pointsSize = this.pointsSize.filter(function (d) {
				return !isNaN(d);
			});
			this.filterSizeFlag = false;
		}
		this.typedSizeArray = new Float32Array(this.pointsSize);
		this.pointsSize = [];
		this.sizeUpdate = false;
	}
	if (this.filterPositionFlag) {
		this.typedPositionArray = this.typedPositionArray.filter(function (d) {
			return !isNaN(d);
		});
		this.filterPositionFlag = false;
	}
	if (this.filterColorFlag) {
		this.typedColorArray = this.typedColorArray.filter(function (d) {
			return !isNaN(d);
		});
		this.filterColorFlag = false;
	}
	if (this.filterSizeFlag) {
		this.typedSizeArray = this.typedSizeArray.filter(function (d) {
			return !isNaN(d);
		});
		this.filterSizeFlag = false;
	}

	this.shaderInstance.setUniformData('u_resolution', new Float32Array([this.ctx.canvas.width / ratio, this.ctx.canvas.height / ratio]));
	this.shaderInstance.setUniformData('u_scale', new Float32Array([this.attr.transform.scale[0], this.attr.transform.scale[1]]));
	this.shaderInstance.setUniformData('u_translate', new Float32Array([this.attr.transform.translate[0], this.attr.transform.translate[1]]));
	this.shaderInstance.setAttributeData('a_radius', this.typedSizeArray);
	this.shaderInstance.setAttributeData('a_color', this.typedColorArray);
	this.shaderInstance.setAttributeData('a_position', this.typedPositionArray);

	this.geometry.setDrawRange(0, this.typedPositionArray.length / 2);
	this.shaderInstance.execute();
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.clear();
	}
};

function RenderWebglImages (ctx, attr, style, renderTarget, vDomIndex) {
	this.ctx = ctx;
	this.dom = {};
	this.attr = attr || {};
	this.style = style || {};
	this.vDomIndex = vDomIndex;
	this.textCoor = new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]);
	this.renderTarget = renderTarget;

	if (!this.attr.transform) {
		this.attr.transform = {
			translate: [0.0, 0.0],
			scale: [1.0, 1.0]
		};
	}

	this.geometry = new MeshGeometry();
	this.geometry.setAttr('a_texCoord', {
		value: this.textCoor,
		size: 2
	});
	this.geometry.setAttr('a_position', {
		value: new Float32Array([]),
		size: 2
	});
	this.geometry.setDrawRange(0, 6);

	this.shaderInstance = new RenderWebglShader(ctx, {
		fragmentShader: modules_shaders('image').fragmentShader,
		vertexShader: modules_shaders('image').vertexShader,
		uniforms: {
			u_resolution: {
				value: new Float32Array([1.0, 1.0])
			},
			u_translate: {
				value: new Float32Array(this.attr.transform.translate)
			},
			u_scale: {
				value: new Float32Array(this.attr.transform.scale)
			},
			u_image: {
				value: new TextureObject(this.ctx, {}, this.vDomIndex)
			}
		},
		geometry: this.geometry
	}, vDomIndex);

	this.positionArray = [];
	this.vertexUpdate = true;
};

RenderWebglImages.prototype = new ShaderNodePrototype();
RenderWebglImages.prototype.constructor = RenderWebglImages;

RenderWebglImages.prototype.clear = function (index) {
	this.positionArray[index] = undefined;
	this.filterPositionFlag = true;
};

RenderWebglImages.prototype.updateVertexX = function (index, x, width) {
	let positionArray = this.positionArray[index];
	let x1 = x + width;
	positionArray[0] = positionArray[4] = positionArray[6] = x;
	positionArray[2] = positionArray[8] = positionArray[10] = x1;
};

RenderWebglImages.prototype.updateVertexY = function (index, y, height) {
	let positionArray = this.positionArray[index];
	let y1 = y + height;
	positionArray[1] = positionArray[3] = positionArray[9] = y;
	positionArray[5] = positionArray[7] = positionArray[11] = y1;
};

RenderWebglImages.prototype.addVertex = function (x, y, width, height, index) {
	let positionArray = new Float32Array(12);
	let x1 = x + width;
	let y1 = y + height;

	positionArray[0] = positionArray[4] = positionArray[6] = x;
	positionArray[1] = positionArray[3] = positionArray[9] = y;
	positionArray[2] = positionArray[8] = positionArray[10] = x1;
	positionArray[5] = positionArray[7] = positionArray[11] = y1;

	this.positionArray[index] = positionArray;

	this.vertexUpdate = true;
};

RenderWebglImages.prototype.execute = function (stack) {
	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.update();
	}

	this.shaderInstance.useProgram();

	if (!this.attr.transform.scale) {
		this.attr.transform.scale = [1.0, 1.0];
	}

	if (!this.attr.transform.translate) {
		this.attr.transform.translate = [0.0, 0.0];
	}

	this.shaderInstance.applyUniformData('u_resolution', new Float32Array([this.ctx.canvas.width / ratio, this.ctx.canvas.height / ratio]));
	this.shaderInstance.applyUniformData('u_scale', this.attr.transform.scale);
	this.shaderInstance.applyUniformData('u_translate', this.attr.transform.translate);
	this.shaderInstance.applyAttributeData('a_texCoord', this.textCoor);

	if (this.filterPositionFlag) {
		this.positionArray = this.positionArray.filter(function (d) {
			return d;
		});
		this.filterPositionFlag = false;
	}

	for (var i = 0, len = stack.length; i < len; i++) {
		let node = stack[i];
		if (typeof node.attr.src === 'string') {
			if (!webGLImageTextures[node.attr.src].updated) {
				continue;
			}
			webGLImageTextures[node.attr.src].loadTexture();
			this.shaderInstance.applyUniformData('u_image', webGLImageTextures[node.attr.src]);
		} else if (node.attr.src instanceof TextureObject) {
			node.attr.src.loadTexture();
			this.shaderInstance.applyUniformData('u_image', node.attr.src);
		}
		this.shaderInstance.applyAttributeData('a_position', this.positionArray[i]);
		this.shaderInstance.draw();
	}

	if (this.renderTarget && this.renderTarget instanceof RenderTarget) {
		this.renderTarget.clear();
	}
};

function getTypeShader (ctx, attr, style, type, renderTarget, vDomIndex) {
	let e;

	switch (type) {
		case 'rect':
			e = new RenderWebglRects(ctx, attr, style, renderTarget, vDomIndex);
			break;

		case 'point':
			e = new RenderWebglPoints(ctx, attr, style, renderTarget, vDomIndex);
			break;

		case 'line':
			e = new RenderWebglLines(ctx, attr, style, renderTarget, vDomIndex);
			break;

		case 'polyline':
			e = new RenderWebglPolyLines(ctx, attr, style, renderTarget, vDomIndex);
			break;

		case 'polygon':
			e = new RenderWebglPolygons(ctx, attr, style, renderTarget, vDomIndex);
			break;

		case 'circle':
			e = new RenderWebglCircles(ctx, attr, style, renderTarget, vDomIndex);
			break;

		case 'image':
			e = new RenderWebglImages(ctx, attr, style, renderTarget, vDomIndex);
			break;

		default:
			e = null;
			break;
	}

	return e;
}

function WebglNodeExe (ctx, config, id, vDomIndex) {
	this.ctx = ctx;
	this.style = config.style || {};
	this.attr = config.attr || {};
	this.id = id;
	this.nodeName = config.el;
	this.nodeType = 'WEBGL';
	this.children = [];
	this.ctx = ctx;
	this.vDomIndex = vDomIndex;
	this.el = config.el;
	this.shaderType = config.shaderType;
	this.exeCtx = config.ctx;

	switch (config.el) {
		case 'point':
			this.dom = new PointNode(this.attr, this.style);
			break;

		case 'rect':
			this.dom = new RectNode(this.attr, this.style);
			break;

		case 'line':
			this.dom = new LineNode(this.attr, this.style);
			break;

		case 'polyline':
			this.dom = new PolyLineNode(this.attr, this.style);
			break;

		case 'polygon':
			this.dom = new PolygonNode(this.attr, this.style);
			break;

		case 'circle':
			this.dom = new CircleNode(this.attr, this.style);
			break;

		case 'image':
			this.dom = new ImageNode(this.ctx, this.attr, this.style, vDomIndex);
			break;

		case 'group':
			this.dom = new WebglGroupNode(this.ctx, this.attr, this.style, config.renderTarget, vDomIndex);
			break;

		default:
			this.dom = null;
			break;
	}

	this.dom.nodeExe = this;
	if (!(this.dom instanceof WebglGroupNode)) {
		delete this.createEl;
		delete this.createEls;
	}
}

WebglNodeExe.prototype = new NodePrototype();

WebglNodeExe.prototype.reIndexChildren = function () {
	this.children = this.children.filter(function (d) {
		return d;
	});
	for (var i = 0, len = this.children.length; i < len; i++) {
		this.children[i].dom.pindex = i;
	};
};

WebglNodeExe.prototype.setAttr = function WsetAttr (attr, value) {
	if (arguments.length === 2) {
		if (!value) {
			delete this.attr[attr];
		} else {
			this.attr[attr] = value;
			this.dom.setAttr(attr, value);
		}
	} else if (arguments.length === 1 && typeof attr === 'object') {
		for (let key in attr) {
			this.attr[key] = attr[key];
			this.dom.setAttr(key, attr[key]);
		}
	}

	webgl_queueInstance.vDomChanged(this.vDomIndex);
	return this;
};

WebglNodeExe.prototype.setStyle = function WsetStyle (attr, value) {
	if (arguments.length === 2) {
		if (attr === 'fill' || attr === 'stroke') {
			value = modules_colorMap.colorToRGB(value);
		}
		this.style[attr] = value;
		this.dom.setStyle(attr, value);
	} else if (arguments.length === 1 && typeof attr === 'object') {
		for (let key in attr) {
			value = attr[key];

			if (key === 'fill' || key === 'stroke') {
				value = modules_colorMap.colorToRGB(attr[key]);
			}
			this.style[key] = value;
			this.dom.setStyle(key, value);
		}
	}

	webgl_queueInstance.vDomChanged(this.vDomIndex);
	return this;
};

WebglNodeExe.prototype.setReIndex = function () {
	this.reindex = true;
};

WebglNodeExe.prototype.execute = function Cexecute () {
	if (!this.dom.shader && this.dom instanceof WebglGroupNode) {
		for (let i = 0, len = this.children.length; i < len; i += 1) {
			this.children[i].execute();
		}
	} else if (this.dom.shader && this.dom instanceof WebglGroupNode) {
		if (this.reindex) {
			this.reIndexChildren();
			this.reindex = false;
		}
		if (this.exeCtx) {
			this.exeCtx(this.ctx);
		}
		this.dom.shader.execute(this.children);
	}
};

WebglNodeExe.prototype.child = function child (childrens) {
	const self = this;
	let node;
	if (self.dom instanceof WebglGroupNode) {
		for (let i = 0; i < childrens.length; i += 1) {
			node = childrens[i];
			node.dom.parent = self;
			self.children[self.children.length] = node;
			node.dom.pindex = self.children.length - 1;
			if (!(node instanceof RenderWebglShader)) {
				node.dom.setShader(this.dom.shader);
			}
		}
	} else {
		console.log('Error');
	}

	this.BBoxUpdate = true;
	webgl_queueInstance.vDomChanged(this.vDomIndex);
	return self;
};

WebglNodeExe.prototype.createEls = function CcreateEls (data, config) {
	const e = new WebglCollection({
		type: 'WEBGL',
		ctx: this.dom.ctx
	}, data, config, this.vDomIndex);
	this.child(e.stack);
	webgl_queueInstance.vDomChanged(this.vDomIndex);
	return e;
};

WebglNodeExe.prototype.createEl = function WcreateEl (config) {
	const e = new WebglNodeExe(this.ctx, config, domId(), this.vDomIndex);
	this.child([e]);
	webgl_queueInstance.vDomChanged(this.vDomIndex);
	return e;
};

WebglNodeExe.prototype.createShaderEl = function createShader (shaderObject) {
	const e = new RenderWebglShader(this.ctx, shaderObject, this.vDomIndex);
	this.child([e]);
	webgl_queueInstance.vDomChanged(this.vDomIndex);
	return e;
};

WebglNodeExe.prototype.remove = function Wremove () {
	const {
		children
	} = this.dom.parent;
	const index = children.indexOf(this);

	if (index !== -1) {
		if (this.dom.parent.dom.shader) {
			this.dom.parent.dom.shader.clear(this.dom.pindex);
			children[this.dom.pindex] = undefined;
			this.dom.parent.setReIndex();
		} else {
			children.splice(index, 1);
		}
	}

	this.BBoxUpdate = true;
	webgl_queueInstance.vDomChanged(this.vDomIndex);
};

WebglNodeExe.prototype.removeChild = function WremoveChild (obj) {
	let index = -1;
	this.children.forEach((d, i) => {
		if (d === obj) {
			index = i;
		}
	});

	if (index !== -1) {
		const removedNode = this.children.splice(index, 1)[0];
		this.dom.removeChild(removedNode.dom);
	}

	webgl_queueInstance.vDomChanged(this.vDomIndex);
};

function webglLayer (container, contextConfig = {}, layerSettings = {}) {
	const res = container ? document.querySelector(container) : null;
	let height = res ? res.clientHeight : 0;
	let width = res ? res.clientWidth : 0;
	let clearColor = modules_colorMap.rgba(0, 0, 0, 0);
	let { autoUpdate = true, enableResize = true } = layerSettings;

	contextConfig = contextConfig || {
		premultipliedAlpha: false,
		depth: false,
		antialias: false,
		alpha: true
	};
	const layer = document.createElement('canvas');
	const ctx = layer.getContext('webgl', contextConfig);

	ratio = getPixlRatio(ctx);
	// ctx.enable(ctx.BLEND);
	// ctx.blendFunc(ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
	// ctx.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
	layer.setAttribute('height', height * ratio);
	layer.setAttribute('width', width * ratio);
	layer.style.height = `${height}px`;
	layer.style.width = `${width}px`;
	layer.style.position = 'absolute';

	let vDomInstance;
	let vDomIndex = 999999;
	let cHeight;
	let cWidth;
	let resizeCall;
	let onChangeExe;

	if (res) {
		res.appendChild(layer);
		vDomInstance = new modules_VDom();
		if (autoUpdate) {
			vDomIndex = webgl_queueInstance.addVdom(vDomInstance);
		}
	}
	
	const root = new WebglNodeExe(ctx, {
		el: 'group',
		attr: {
			id: 'rootNode'
		},
		ctx: function (ctx) {
			ctx.enable(ctx.BLEND);
			ctx.blendFunc(ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
			ctx.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
		}
	}, domId(), vDomIndex);

	if (vDomInstance) {
		vDomInstance.rootNode(root);
	}
	const execute = root.execute.bind(root);
	root.container = res;
	root.domEl = layer;
	root.height = height;
	root.width = width;
	root.type = 'WEBGL';
	root.pixelRatio = ratio;

	let onClear = function (ctx) {
		ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
	};

	root.execute = function () {
		onClear(this.ctx);
		execute();
	};

	root.update = function () {
		this.execute();
	};

	root.destroy = function () {
		let res = document.querySelector(container);
		if (res && res.contains(layer)) {
			res.removeChild(layer);
		}
		webgl_queueInstance.removeVdom(vDomIndex);
	};

	root.getPixels = function (x, y, width_, height_) {
		let pixels = new Uint8Array(width_ * height_ * 4);
		this.ctx.readPixels(x, y, width_, height_, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, pixels);
		return pixels;
	};

	root.putPixels = function (imageData, x, y) {
		return this.ctx.putImageData(imageData, x, y);
	};

	root.clear = function () {
		onClear(this.ctx);
	};

	root.setClearColor = function (color) {
		 clearColor = color;
	};

	root.setClear = function (exe) {
		 onClear = exe;
	};

	let resize = function () {
		if (!document.querySelector(container)) {
			window.removeEventListener('resize', resize);
			return;
		}
		height = cHeight || res.clientHeight;
		width = cWidth || res.clientWidth;
		layer.setAttribute('height', height * ratio);
		layer.setAttribute('width', width * ratio);
		layer.style.height = `${height}px`;
		layer.style.width = `${width}px`;
		root.width = width;
		root.height = height;

		if (resizeCall) {
			resizeCall();
		}

		root.execute();
	};

	root.onResize = function (exec) {
		resizeCall = exec;
	};

	root.onChange = function (exec) {
		onChangeExe = exec;
	};

	root.invokeOnChange = function () {
		if (onChangeExe) {
			onChangeExe();
		}
	};

	root.setSize = function (width_, height_) {
		this.domEl.setAttribute('height', height_ * ratio);
		this.domEl.setAttribute('width', width_ * ratio);
		this.domEl.style.height = `${height_}px`;
		this.domEl.style.width = `${width_}px`;
		this.width = width_;
		this.height = height_;
		height = height_;
		width = width_;
		this.execute();
	};

	root.setViewBox = function (x, y, height, width) {
	};

	root.setStyle = function (prop, value) {
		this.domEl.style[prop] = value;
	};

	root.setAttr = function (prop, value) {
		if (prop === 'viewBox') {
			this.setViewBox.apply(this, value.split(','));
		}
		layer.setAttribute(prop, value);
	};

	root.setContext = function (prop, value) {
		/** Expecting value to be array if multiple aruments */
		if (this.ctx[prop] && typeof this.ctx[prop] === 'function') {
			this.ctx[prop].apply(null, value);
		} else if (this.ctx[prop]) {
			this.ctx[prop] = value;
		}
	};

	root.MeshGeometry = function () {
		return new MeshGeometry(this.ctx);
	};

	root.PointsGeometry = function () {
		return new PointsGeometry(this.ctx);
	};

	root.LineGeometry = function () {
		return new LineGeometry(this.ctx);
	};

	root.TextureObject = function (config) {
		return new TextureObject(this.ctx, config, this.vDomIndex);
	};

	root.RenderTarget = function (config) {
		return new RenderTarget(this.ctx, config, this.vDomIndex);
	};

	webgl_queueInstance.execute();

	if (enableResize) {
		window.addEventListener('resize', resize);
	}

	return root;
}

function imageInstance (self) {
	let imageIns = new Image();
	imageIns.onload = function onload () {
		this.crossOrigin = 'anonymous';
		self.update();
		self.updated = true;
		webgl_queueInstance.vDomChanged(self.vDomIndex);
	};

	imageIns.onerror = function onerror (onerrorExe) {
		if (onerrorExe && typeof onerrorExe === 'function') {
			// onerrorExe.call(nodeExe)
		}
	};

	return imageIns;
}

function TextureObject (ctx, config, vDomIndex) {
	let self = this;
	this.ctx = ctx;
	this.texture = ctx.createTexture();
	this.type = 'TEXTURE_2D';
	this.width = config.width ? config.width : 0;
	this.height = config.height ? config.height : 0;
	this.border = config.border ? config.border : 0;
	this.format = config.format ? config.format : 'RGBA';
	this.type = config.type ? config.type : 'UNSIGNED_BYTE';
	// this.pixels = config.pixels ? config.pixels : null;
	this.warpS = config.warpS ? config.warpS : 'CLAMP_TO_EDGE';
	this.warpT = config.warpT ? config.warpT : 'CLAMP_TO_EDGE';
	this.magFilter = config.magFilter ? config.magFilter : 'LINEAR';
	this.minFilter = config.minFilter ? config.minFilter : 'LINEAR';
	this.mipMap = config.mipMap;
	this.updated = false;
	this.image = null;
	// this.image = new Image();
	this.vDomIndex = vDomIndex;

	if (typeof config.src === 'string') {
		self.image = imageInstance(self);
		self.image.src = config.src;
	} else if (config.src instanceof HTMLImageElement || config.src instanceof SVGImageElement || config.src instanceof HTMLCanvasElement || config.src instanceof Uint8Array) {
		self.image = config.src;
		self.update();
		self.updated = true;
	} else if (config.src instanceof NodePrototype) {
		self.image = config.src.domEl;
		self.update();
		self.updated = true;
	}
	webgl_queueInstance.vDomChanged(self.vDomIndex);
};
TextureObject.prototype.setAttr = function (attr, value) {
	this[attr] = value;
	if (attr === 'src') {
		if (typeof value === 'string') {
			if (!this.image || !(this.image instanceof Image)) {
				this.image = imageInstance(this);
			}
			this.image.src = value;
		} else if (value instanceof HTMLImageElement || value instanceof SVGImageElement || value instanceof HTMLCanvasElement || value instanceof Uint8Array) {
			this.image = value;
			this.update();
			this.updated = true;
		} else if (value instanceof NodePrototype) {
			this.image = value.domEl;
			this.update();
			this.updated = true;
		}
	}
};

TextureObject.prototype.loadTexture = function () {
	// this.ctx.activeTexture(this.ctx.TEXTURE0);
	this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture);
};

TextureObject.prototype.update = function () {
	let ctx = this.ctx;

	ctx.bindTexture(ctx.TEXTURE_2D, this.texture);
	if (this.image && !(this.image instanceof Uint8Array)) {
		ctx.texImage2D(ctx.TEXTURE_2D, this.border, ctx[this.format], ctx[this.format], ctx[this.type], this.image);
	} else {
		ctx.texImage2D(ctx.TEXTURE_2D, this.border, ctx[this.format], this.width, this.height, 0, ctx[this.format], ctx[this.type], this.image);
	}

	if (this.mipMap) {
		if (!isPowerOf2(self.image.width) || !isPowerOf2(self.image.height)) {
			console.warn('Image dimension not in power of 2');
		}
		ctx.generateMipmap(ctx.TEXTURE_2D);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx[this.minFilter]);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx[this.magFilter]);
	} else {
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx[this.warpS]);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx[this.warpT]);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx[this.minFilter]);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx[this.minFilter]);
	}
};

function RenderTarget (ctx, config) {
	this.ctx = ctx;
	this.fbo = ctx.createFramebuffer();
	this.texture = config.texture;
};

RenderTarget.prototype.setAttr = function (attr, value) {
	this[attr] = value;
};

RenderTarget.prototype.update = function () {
	if (!this.texture || !(this.texture instanceof TextureObject)) {
		return;
	}
	this.texture.update();
	this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, this.fbo);
	this.ctx.framebufferTexture2D(this.ctx.FRAMEBUFFER, this.ctx.COLOR_ATTACHMENT0, this.ctx.TEXTURE_2D, this.texture.texture, 0);
};

RenderTarget.prototype.clear = function () {
	this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, null);
};

function WebGLGeometry () {
	this.attributes = {};
	this.indexes = null;
	this.drawRange = [0, 0];
}
WebGLGeometry.prototype.setAttr = function (attr, value) {
	if (!value && this.attributes[attr]) {
		delete this.attributes[attr];
	} else {
		this.attributes[attr] = value;
	}
};
WebGLGeometry.prototype.setDrawRange = function (start, end) {
	this.drawRange = [start, end];
};
WebGLGeometry.prototype.setDrawType = function (type) {
	this.drawType = type;
};
WebGLGeometry.prototype.setIndex = function (obj) {
	this.indexes = obj;
};

function MeshGeometry (ctx) {
	this.drawType = 'TRIANGLES';
};
MeshGeometry.prototype = new WebGLGeometry();
MeshGeometry.constructor = MeshGeometry;

function PointsGeometry (ctx) {
	this.drawType = 'POINTS';
}

PointsGeometry.prototype = new WebGLGeometry();
PointsGeometry.constructor = PointsGeometry;

function LineGeometry (ctx) {
	this.drawType = 'LINES';
};

LineGeometry.prototype = new WebGLGeometry();
LineGeometry.constructor = LineGeometry;

/* harmony default export */ var webgl = __webpack_exports__["a"] = (webglLayer);


/***/ })
]]);