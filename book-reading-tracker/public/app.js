const form = document.getElementById("book-form");
const bookList = document.getElementById("book-list");
const totalBooks = document.getElementById("total-books");
const totalPages = document.getElementById("total-pages");
if (!form || !bookList || !totalBooks || !totalPages) {
  throw new Error("Required DOM elements not found.");
}
const bookForm = form;
const bookListEl = bookList;
const totalBooksEl = totalBooks;
const totalPagesEl = totalPages;
const API_BASE = window.location.port === "2004" ? "" : `${window.location.protocol}//${window.location.hostname}:2004`;
function readingPercent(book) {
  if (!book.numberOfPages) {
    return 0;
  }
  return Math.round(book.numberOfPagesRead / book.numberOfPages * 100);
}
function renderBooks(books) {
  const finishedCount = books.filter((book) => book.finished).length;
  const pagesReadTotal = books.reduce((sum, book) => sum + (book.numberOfPagesRead || 0), 0);
  totalBooksEl.textContent = String(finishedCount);
  totalPagesEl.textContent = String(pagesReadTotal);
  bookListEl.innerHTML = books.map((book) => {
    const bookId = book._id ?? "";
    const percent = readingPercent(book);
    return `
        <article class="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-semibold text-white">${escapeHtml(book.title)}</h3>
              <p class="text-sm text-slate-400">${escapeHtml(book.author)} \u2022 ${escapeHtml(book.status)} \u2022 ${escapeHtml(book.format)}</p>
              <p class="text-xs text-slate-500">Suggested by ${escapeHtml(book.suggestedBy)}</p>
            </div>
            <div class="text-right text-sm text-slate-300">
              <p class="text-white">${book.numberOfPagesRead}/${book.numberOfPages} pages</p>
              <p class="text-xs text-slate-500">${percent}%</p>
            </div>
          </div>
          <div class="mt-3 h-2 rounded-full bg-slate-800">
            <div class="h-full rounded-full bg-cyan-400" style="width: ${percent}%;"></div>
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <form data-update-form data-book-id="${bookId}" class="flex items-center gap-3">
              <input
                name="numberOfPagesRead"
                type="number"
                min="0"
                max="${book.numberOfPages}"
                value="${book.numberOfPagesRead}"
                class="w-28 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white"
              />
              <button
                type="submit"
                class="rounded-full border border-cyan-400/60 px-4 py-2 text-xs font-semibold text-cyan-200"
              >
                Update pages
              </button>
            </form>
            <button
              type="button"
              data-delete-book
              data-book-id="${bookId}"
              class="rounded-full border border-rose-400/60 px-4 py-2 text-xs font-semibold text-rose-200"
            >
              Delete
            </button>
          </div>
        </article>
      `;
  }).join("");
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
async function fetchBooks() {
  const response = await fetch(`${API_BASE}/getBooks`);
  if (!response.ok) {
    throw new Error("Failed to load books.");
  }
  const books = await response.json();
  renderBooks(books);
}
bookForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(bookForm);
  const payload = Object.fromEntries(formData.entries());
  const body = {
    ...payload,
    numberOfPages: Number(payload.numberOfPages),
    numberOfPagesRead: Number(payload.numberOfPagesRead),
    price: Number(payload.price)
  };
  const response = await fetch(`${API_BASE}/addBook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const error = await response.json();
    alert(error.message ?? "Failed to add book.");
    return;
  }
  bookForm.reset();
  const pagesReadField = bookForm.querySelector('[name="numberOfPagesRead"]');
  if (pagesReadField) {
    pagesReadField.value = "0";
  }
  await fetchBooks();
});
bookListEl.addEventListener("submit", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLFormElement) || !target.hasAttribute("data-update-form")) {
    return;
  }
  event.preventDefault();
  const bookId = target.getAttribute("data-book-id");
  if (!bookId) {
    return;
  }
  const input = target.querySelector('[name="numberOfPagesRead"]');
  const numberOfPagesRead = input ? Number(input.value) : NaN;
  if (Number.isNaN(numberOfPagesRead)) {
    return;
  }
  const response = await fetch(`${API_BASE}/updatePagesRead/${bookId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numberOfPagesRead })
  });
  if (!response.ok) {
    const error = await response.json();
    alert(error.message ?? "Failed to update pages.");
    return;
  }
  await fetchBooks();
});
bookListEl.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement) || !target.hasAttribute("data-delete-book")) {
    return;
  }
  const bookId = target.getAttribute("data-book-id");
  if (!bookId) {
    return;
  }
  const response = await fetch(`${API_BASE}/deleteBook/${bookId}`, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.json();
    alert(error.message ?? "Failed to delete book.");
    return;
  }
  await fetchBooks();
});
fetchBooks().catch((error) => {
  console.error(error);
  alert("Could not load books. Is the server running?");
});
