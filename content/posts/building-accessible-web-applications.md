# Building Accessible Web Applications

Accessibility isn't a nice-to-have — it's a fundamental requirement. Over 1 billion people worldwide have some form of disability, and the web should work for everyone.

## The WCAG Principles: POUR

### Perceivable
Users must be able to perceive the content:
- Provide **alt text** for all meaningful images
- Use **sufficient color contrast** (4.5:1 for normal text)
- Don't rely on **color alone** to convey information
- Provide **captions** for video content

### Operable
Users must be able to operate the interface:
- All functionality must be available via **keyboard**
- Provide **skip navigation** links
- Give users **enough time** to read and interact
- Don't design content that could cause **seizures**

### Understandable
Users must be able to understand the content:
- Use **clear, simple language**
- Make web pages **behave predictably**
- Help users **avoid and correct mistakes**

### Robust
Content must work with a wide variety of technologies:
- Use **valid, semantic HTML**
- Ensure compatibility with **assistive technologies**
- Test with **screen readers** (NVDA, VoiceOver, JAWS)

## ARIA: When HTML Isn't Enough

ARIA (Accessible Rich Internet Applications) attributes help bridge gaps:

```html
<button 
  aria-expanded="false" 
  aria-controls="menu-dropdown"
  aria-label="Open navigation menu"
>
  Menu
</button>
```

> **The First Rule of ARIA:** Don't use ARIA if you can use native HTML instead.

## Testing Your Accessibility

1. **Automated tools:** axe, Lighthouse, WAVE
2. **Keyboard testing:** Tab through your entire app
3. **Screen reader testing:** Use VoiceOver (Mac) or NVDA (Windows)
4. **User testing:** Nothing replaces testing with real users

---

Building accessible applications isn't just the right thing to do — it creates better experiences for everyone. Start with semantic HTML, test with a keyboard, and iterate from there.
