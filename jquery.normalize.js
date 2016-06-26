/**@preserve https://github.com/ralfhergert/jquery-normalize
 * jQuery wrapper for DOM normalization */
/** Normalization is the process of joining together adjacent textNodes. In DOM
 * there is node-method called normalize specified for it, but IE apparently has
 * a bug joining two text node if they are split by a soft or regular hyphen.
 * This jQuery extension will test whether the native browser implementation
 * works, else it will use a fallback implementation. */
(function(jQuery) {
	// this function tests whether the native normalizing does work.
	var isNativeNormalizeWorking = function(){
		var wrapper = document.createElement('div');
		wrapper.appendChild(document.createTextNode('a'));
		wrapper.appendChild(document.createTextNode('\u00ad')); // append a soft hyphen
		wrapper.appendChild(document.createTextNode('b'));
		/* in IE normalize will only misbehave, when the wrapper is actually added to the DOM, else normalize works correctly.
		 * since the document.body does not exist right now, the document.head is used. */
		var dom = document.body || document.head;
		dom.appendChild(wrapper);
		wrapper.normalize();
		var numberOfChildren = wrapper.childNodes.length;
		dom.removeChild(wrapper);
		return numberOfChildren === 1;
	};
	$.fn.normalize = function() {
		if (isNativeNormalizeWorking()) { // use the native normalize
			window.console.log('using native normalize');
			jQuery(this).each(function(index, node) {
				node.normalize();
			});
		} else { // use the fallback implementation
			window.console.log('using fallback normalize');
			jQuery(this).each(function(index, node) {
				normalize(node);
			});
		}
		return jQuery(this);
	};
	var normalize = function(node) {
		if (!node) {
			return;
		}
		var previousTextNode = null;
		var child = node.firstChild;
		while (child) {
			var next = child.nextSibling;
			if (child.nodeType === 3) { // if this is a text node then handle it.
				if (previousTextNode !== null) { // attach to the previous node if available
					previousTextNode.nodeValue += child.nodeValue;
					node.removeChild(child);
				} else {
					previousTextNode = child;
				}
			} else if (child.nodeType === 1) { // if this is an element
				normalize(this);
				previousTextNode = null;
			}
			child = next;
		}
	};
})(jQuery);
