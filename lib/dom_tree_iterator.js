

/**
 * A class for working with trees of DOM Elements in a linear fashion.
 */
exports.DomTreeIterator = function () {
    this.initialize = function (container) {
        this._container = container;
    };

    this.next = function (location) {
        var nextLocation = location.slice(0);
        var locationLength = nextLocation.length
        var childElementOffset;

        childElementOffset = this._firstChildElementOffset(nextLocation);
        if (childElementOffset || childElementOffset === 0) {
            nextLocation.push(childElementOffset);
            return nextLocation;
        }

        for (index = locationLength; index--;) {
            peerElementOffset = this._nextPeerElementOffset(nextLocation);
            if (peerElementOffset || peerElementOffset === 0) {
                nextLocation[nextLocation.length - 1] = peerElementOffset;
                return nextLocation;
            } else {
                nextLocation.pop();
            }
        }

        return [];
    };

    this._firstChildElementOffset = function (location) {
        var element = this._elementAtLocation(location);
        var index, childCount = element.childNodes.length;
        var childElementOffset;
        for (offset = 0; offset < childCount; offset++) {
            if (element.childNodes[offset].nodeType === 1) {
                childElementOffset = offset;
                break;
            }
        }
        return childElementOffset;
    };

    this._nextPeerElementOffset = function (location) {
        var parent = this._elementAtLocation(location, 1);
        var selfOffset = location.slice(-1)[0];
        var index, childCount = parent.childNodes.length;
        var peerElementOffset;
        for (offset = selfOffset + 1; offset < childCount; offset++) {
            if (parent.childNodes[offset].nodeType === 1) {
                peerElementOffset = offset;
                break;
            }
        }
        return peerElementOffset;
    };

    this._elementAtLocation = function (location, popLength) {
        var index, locationLength = location.length;
        var currentElement = this._container;
        popLength = popLength || 0
        for (index = 0; index < locationLength - popLength; index++) {
            currentElement = currentElement.childNodes[location[index]];
        }
        return currentElement;
    };

    this.initialize.apply(this, arguments);
};