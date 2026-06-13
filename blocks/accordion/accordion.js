/**
 * Accordion block implementation
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // Get all accordion items (each child div is an item)
  const items = [...block.children];

  items.forEach((item, index) => {
    // Extract heading and content from the item
    const children = [...item.children];

    // Create accordion structure: heading + content
    if (children.length >= 2) {
      const heading = children[0];
      const content = children.slice(1);

      // Wrap heading in button for toggle
      heading.tagName = 'BUTTON';
      heading.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
      heading.setAttribute('aria-controls', `accordion-content-${index}`);
      heading.classList.add('accordion-heading');

      // Create content container
      const contentWrapper = document.createElement('div');
      contentWrapper.id = `accordion-content-${index}`;
      contentWrapper.className = index === 0 ? 'accordion-content open' : 'accordion-content';
      contentWrapper.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');

      // Move content into wrapper
      content.forEach((child) => {
        contentWrapper.appendChild(child);
      });

      // Replace item contents with accordion structure
      item.innerHTML = '';
      item.appendChild(heading);
      item.appendChild(contentWrapper);
    } else if (children.length === 1) {
      // Handle case where there's only one child - treat as heading-only
      const heading = children[0];
      heading.tagName = 'BUTTON';
      heading.classList.add('accordion-heading');
      heading.setAttribute('aria-expanded', 'false');
      heading.setAttribute('aria-controls', `accordion-content-${index}`);
    }
  });

  // Add click handlers for toggling
  block.querySelectorAll('.accordion-heading').forEach((heading) => {
    heading.addEventListener('click', () => {
      const isOpen = heading.getAttribute('aria-expanded') === 'true';
      const contentId = heading.getAttribute('aria-controls');
      const content = document.getElementById(contentId);

      // Toggle current item
      heading.setAttribute('aria-expanded', !isOpen);
      if (content) {
        content.classList.toggle('open');
        content.setAttribute('aria-hidden', isOpen);
      }
    });
  });

  // Add keyboard navigation support
  block.querySelectorAll('.accordion-heading').forEach((heading) => {
    heading.addEventListener('keydown', (e) => {
      const headings = [...block.querySelectorAll('.accordion-heading')];
      const currentIndex = headings.indexOf(heading);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < headings.length - 1) {
            headings[currentIndex + 1].focus();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            headings[currentIndex - 1].focus();
          }
          break;
        case 'Home':
          e.preventDefault();
          headings[0].focus();
          break;
        case 'End':
          e.preventDefault();
          headings[headings.length - 1].focus();
          break;
        default:
          break;
      }
    });
  });
}
