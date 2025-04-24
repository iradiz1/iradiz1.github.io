// Smooth scroll for internal links (if needed)
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
	  e.preventDefault();
	  const target = document.querySelector(this.getAttribute('href'));
	  if (target) {
		target.scrollIntoView({
		  behavior: 'smooth'
		});
	  }
	});
  });
  
  document.addEventListener('DOMContentLoaded', () => {
	const menuBtn = document.querySelector('.menu-button');
	const cartBtn = document.querySelector('.cart-button');
	const menuPanel = document.getElementById('menu-panel');
	const cartPanel = document.getElementById('cart-panel');
	const overlay = document.getElementById('overlay');
  
	function closePanels() {
	  menuPanel.classList.remove('open');
	  cartPanel.classList.remove('open');
	  overlay.classList.remove('active');
	  location.reload();
	}
  
	menuBtn.addEventListener('click', () => {
	  const isOpen = menuPanel.classList.toggle('open');
	  cartPanel.classList.remove('open');
	  overlay.classList.toggle('active', isOpen);
	});
  
	cartBtn.addEventListener('click', () => {
	  const isOpen = cartPanel.classList.toggle('open');
	  menuPanel.classList.remove('open');
	  overlay.classList.toggle('active', isOpen);
	});
  
	// Expose to global for inline `onclick="closePanels()"`
	window.closePanels = closePanels;
  });

  
  document.addEventListener('DOMContentLoaded', () => {
	const topBar = document.querySelector('.top-bar');
  
	window.addEventListener('scroll', () => {
	  if (window.scrollY > 10) {
		topBar.classList.add('scrolled');
	  } else {
		topBar.classList.remove('scrolled');
	  }
	});
  });


  document.addEventListener('DOMContentLoaded', () => {
	const topBar = document.querySelector('.top-bar');
	let lastScrollY = window.scrollY;
  
	window.addEventListener('scroll', () => {
	  const currentScrollY = window.scrollY;
	  const scrollHeight = document.documentElement.scrollHeight;
	const windowHeight = window.innerHeight;
	const isAtBottom = currentScrollY + windowHeight >= scrollHeight - 5;

		if (isAtBottom) {
  		return; // Don't show the top bar again at the bottom
		}
  
	  if (currentScrollY > lastScrollY && currentScrollY > 150) {
		// Scrolling down
		topBar.classList.add('hide');
	  } else {
		// Scrolling up
		topBar.classList.remove('hide');
	  }
  
	  // Handle background switch
	  if (currentScrollY > 10) {
		topBar.classList.add('scrolled');
	  } else {
		topBar.classList.remove('scrolled');
	  }
  
	  lastScrollY = currentScrollY;
	});
  });
  

// Load cart from localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
	const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
	storedCart.forEach(item => cartItems.push(item));
	updateCart();
  });
  
  const cartItems = [];

  function addToCart(name, imagePath, price = 0) {
	const existingItem = cartItems.find(item =>
	  item.name === name &&
	  item.image === imagePath &&
	  item.price === price
	);
  
	if (existingItem) {
	  existingItem.quantity += 1;
	} else {
	  cartItems.push({ name, image: imagePath, price, quantity: 1 });
	}
  
	localStorage.setItem('cartItems', JSON.stringify(cartItems));
	updateCart();
  }
  
  
  function changeQuantity(index, change) {
	cartItems[index].quantity += change;
  
	if (cartItems[index].quantity <= 0) {
	  cartItems.splice(index, 1);
	}
  
	localStorage.setItem('cartItems', JSON.stringify(cartItems));
	updateCart();
  }
  
  function updateCart() {
	const cartList = document.getElementById('cart-items');
	if (!cartList) return;
  
	cartList.innerHTML = '';
	cartItems.forEach((item, index) => {
	  const li = document.createElement('li');
	  li.innerHTML = `
		<div class="cart-item-content">
		  <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
		  <div class="cart-item-info">
			<span class="cart-item-name">${item.name}</span>
			<span class="cart-item-price">${(item.price * item.quantity).toFixed(2)} €</span>
			<span class="cart-item-quantity">
			  <button class="qty-btn" onclick="changeQuantity(${index}, -1)">−</button>
			  ${item.quantity}
			  <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
			</span>
		  </div>
		  <button class="remove-item" onclick="removeFromCart(${index})">
			<img src="images/bx-trash.svg" alt="Remove" class="trash-icon" />
		  </button>
		</div>
	  `;
	  cartList.appendChild(li);
	});
	
	
  
	const cartCount = document.getElementById('cart-count');
	if (cartCount) {
	  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
	  if (totalItems > 0) {
		cartCount.style.display = 'inline';
		cartCount.innerHTML = `
		  <span class="item-count">${totalItems} item${totalItems !== 1 ? 's' : ''}</span><br>
		  <span class="in-cart">in bag</span>
		`;
	  } else {
		cartCount.style.display = 'none';
	  }
	}
	
  }


  document.addEventListener('DOMContentLoaded', () => {
	const summary = document.getElementById('order-summary');
	if (!summary) return;
  
	const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
  
	if (storedCart.length === 0) {
		summary.innerHTML = '<p class="cart-empty-message">Your cart is empty.</p>';
	  }
	   else {
	  let total = 0;
	  storedCart.forEach((item, index) => {
		const itemTotal = item.price * (item.quantity || 1);
		total += itemTotal;
	  
		const itemDiv = document.createElement('div');
		itemDiv.classList.add('order-item');
		itemDiv.innerHTML = `
		  <img src="${item.image}" alt="${item.name}" class="checkout-item-image" />
		  <div class="checkout-item-details">
			<span class="checkout-item-name">${item.name} × ${item.quantity || 1}</span>
		  </div>
		  <span class="checkout-item-price">${itemTotal.toFixed(2)} €</span>
		  <button class="remove-item" onclick="removeFromCart(${index})">
			<img src="images/bx-trash.svg" alt="Remove" class="trash-icon" />
		  </button>
		`;
		summary.insertBefore(itemDiv, summary.querySelector('.total'));
	  });
	  
  
	  const totalDiv = summary.querySelector('.total');
	  totalDiv.textContent = `Total: ${total.toFixed(2)} €`;
	}
  });

  function removeFromCart(index) {
	const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
	cartItems.splice(index, 1);
	localStorage.setItem('cartItems', JSON.stringify(cartItems));
	location.reload(); // reload the page to reflect changes
  }

  document.addEventListener('DOMContentLoaded', () => {
	const video = document.getElementById('aboutVideo');
	if (!video) return;
  
	const observer = new IntersectionObserver(entries => {
	  entries.forEach(entry => {
		if (entry.isIntersecting) {
		  video.play().catch(err => console.log('Autoplay blocked:', err));
		  video.parentElement.classList.add('playing');
		} else {
		  video.pause();
		  video.parentElement.classList.remove('playing');
		}
	  });
	}, { threshold: 0.5 });
  
	observer.observe(video);
  });
  
  
  
  



  
  
  