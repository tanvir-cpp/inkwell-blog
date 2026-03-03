# JavaScript Performance Optimization

In a world where users expect instant responses, performance isn't optional. Studies show that a 100ms delay in load time reduces conversions by 7%. Let's make your JavaScript lightning fast.

## Measuring Performance

Before optimizing, measure. Use these tools:

- **Chrome DevTools Performance tab** — CPU profiling and flame charts
- **Lighthouse** — Automated performance scoring
- **Web Vitals** — Core metrics (LCP, FID, CLS)

## Lazy Loading

Don't load what users can't see:

```javascript
// Intersection Observer for lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});
```

## Debouncing and Throttling

Control the rate of expensive operations:

```javascript
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Usage
const handleSearch = debounce((query) => {
  fetchResults(query);
}, 300);
```

## Memory Management

Prevent memory leaks:

1. **Remove event listeners** when components unmount
2. **Clear intervals and timeouts**
3. **Use WeakMap and WeakSet** for object references
4. **Avoid global variables**

## Bundle Size Optimization

- **Tree shaking:** Remove unused code
- **Code splitting:** Load code on demand
- **Compression:** Use Brotli or gzip
- **Analyze:** Use `webpack-bundle-analyzer` to find bloat

---

Performance optimization is iterative. Measure, identify bottlenecks, fix, and repeat. Your users will thank you with their engagement and loyalty.
