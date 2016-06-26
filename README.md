# jquery-normalize
jQuery wrapper for DOM normalization.

Usage is:
```javascript
jQuery([selector]).normalize();
```

DOM Normalization is the process of joining together adjacent textNodes. Regarding to the DOM specification (Core Level 2 Node Object) there is already a method named "normalize" specified, but IE apparently has a bug in joining two text nodes if they are split by a soft or regular hyphen.

This is where this extension may help: It determines whether the native implementation for normalize works and then eighter referes to it or a fallback implementation.
