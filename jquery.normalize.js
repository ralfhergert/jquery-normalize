/**@preserve https://github.com/ralfhergert/jquery-normalize
 * jQuery wrapper for DOM normalization */
/** Normalization is the process of joining together adjacent textNodes. In DOM
 * there is node-method called normalize specified for this task, but apparently
 * IE has a bug joining two text nodes if they are split by a soft or regular
 * hyphen.
 * This jQuery extension will test whether the native browser implementation
 * works, else it will use a fallback implementation. */
(function(jQuery) {
	// this function tests whether the native normalizing does work.
	var isNativeNormalizeWorking = function(){
		var wrapper = document.createElement('div');
		wrapper.appendChild(document.createTextNode('a'));
		wrapper.appendChild(document.createTextNode('\u00ad')); // append a soft hyphen
		wrapper.appendChild(document.createTextNode('b'));
		/* in IE normalize will only misbehave, when the wrapper is actually added to the DOM,
		 * else normalize might work correctly. Also IE might switch modes after the document
		 * head is parsed, which means doing this check too early will not discover a faulty
		 * normalize. */
		var dom = document.body || document.head; // fallback to head to prevent an exception.
		dom.appendChild(wrapper);
		wrapper.normalize();
		var numberOfChildren = wrapper.childNodes.length;
		dom.removeChild(wrapper);
		return numberOfChildren === 1;
	};
	$.fn.normalize = function() {
		if (isNativeNormalizeWorking()) { // use the native normalize
			jQuery(this).each(function(index, node) {
				node.normalize();
			});
		} else { // use the fallback implementation
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
