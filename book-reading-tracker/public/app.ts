type Book = {
  _id?: string;
  title: string;
  author: string;
  numberOfPages: number;
  numberOfPagesRead: number;
  status: string;
  format: string;
  suggestedBy: string;
  finished: boolean;
};

const form = document.getElementById('book-form') as HTMLFormElement | null;
const bookList = document.getElementById('book-list') as HTMLDivElement | null;
const totalBooks = document.getElementById('total-books') as HTMLSpanElement | null;
const totalPages = document.getElementById('total-pages') as HTMLSpanElement | null;

if (!form || !bookList || !totalBooks || !totalPages) {
  throw new Error('Required DOM elements not found.');
}

const bookForm = form;
const bookListEl = bookList;
const totalBooksEl = totalBooks;
const totalPagesEl = totalPages;

/** Express on :2004; Live Server (:5500) only serves static files. */
const API_BASE =
  window.location.port === '2004'
    ? ''
    : `${window.location.protocol}//${window.location.hostname}:2004`;

const STATUS_OPTIONS = [
  'Read',
  'Re-read',
  'DNF',
  'Currently reading',
  'Returned Unread',
  'Want to read'
] as const;

const LEGACY_STATUS: Record<string, (typeof STATUS_OPTIONS)[number]> = {
  Re_read: 'Re-read',
  Currently_Reading: 'Currently reading',
  Returned_Unread: 'Returned Unread',
  Want_to_read: 'Want to read'
};

function normalizeStatus(status: string): (typeof STATUS_OPTIONS)[number] {
  const mapped = LEGACY_STATUS[status] ?? status;
  return STATUS_OPTIONS.includes(mapped as (typeof STATUS_OPTIONS)[number])
    ? (mapped as (typeof STATUS_OPTIONS)[number])
    : 'Want to read';
}

function readingPercent(book: Book): number {
  if (!book.numberOfPages) {
    return 0;
  }
  return Math.round((book.numberOfPagesRead / book.numberOfPages) * 100);
}

function renderBooks(books: Book[]) {
  const finishedCount = books.filter((book) => book.finished).length;
  const pagesReadTotal = books.reduce((sum, book) => sum + (book.numberOfPagesRead || 0), 0);

  totalBooksEl.textContent = String(finishedCount);
  totalPagesEl.textContent = String(pagesReadTotal);

  bookListEl.innerHTML = books
    .map((book) => {
      const bookId = book._id ?? '';
      const percent = readingPercent(book);
      const currentStatus = normalizeStatus(book.status);
      return `
        <article class="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-semibold text-white">${escapeHtml(book.title)}</h3>
              <p class="text-sm text-slate-400">${escapeHtml(book.author)} • ${escapeHtml(currentStatus)} • ${escapeHtml(book.format)}</p>
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
            <label class="flex items-center gap-2 text-xs text-slate-400">
              Status
              <select
                data-update-status
                data-book-id="${bookId}"
                data-current-status="${currentStatus}"
                class="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white"
              >
                ${STATUS_OPTIONS.map(
                  (status) =>
                    `<option value="${status}"${status === currentStatus ? ' selected' : ''}>${status}</option>`
                ).join('')}
              </select>
            </label>
            <button
              type="button"
              data-mark-read
              data-book-id="${bookId}"
              class="rounded-full border border-emerald-400/60 px-4 py-2 text-xs font-semibold text-emerald-200"
            >
              Mark as read
            </button>
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
    })
    .join('');

  bindBookListActions();
}

function bindBookListActions(): void {
  bookListEl.querySelectorAll<HTMLSelectElement>('[data-update-status]').forEach((select) => {
    select.addEventListener('change', async () => {
      const bookId = select.dataset.bookId;
      const current = select.dataset.currentStatus;
      if (!bookId || select.value === current) {
        return;
      }

      select.disabled = true;
      await updateBookStatus(bookId, select.value);
      select.disabled = false;
    });
  });

  bookListEl.querySelectorAll<HTMLButtonElement>('[data-mark-read]').forEach((button) => {
    button.addEventListener('click', async () => {
      const bookId = button.dataset.bookId;
      if (!bookId) {
        return;
      }

      button.disabled = true;
      await updateBookStatus(bookId, 'Read');
      button.disabled = false;
    });
  });

  bookListEl.querySelectorAll<HTMLButtonElement>('[data-delete-book]').forEach((button) => {
    button.addEventListener('click', async () => {
      const bookId = button.dataset.bookId;
      if (!bookId) {
        return;
      }

      button.disabled = true;
      const response = await fetch(`${API_BASE}/deleteBook/${bookId}`, { method: 'DELETE' });
      button.disabled = false;

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        alert(error.message ?? 'Failed to delete book.');
        return;
      }

      await fetchBooks();
    });
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function updateBookStatus(bookId: string, status: string): Promise<void> {
  const response = await fetch(`${API_BASE}/updateStatus/${bookId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    const error = (await response.json()) as { message?: string };
    alert(error.message ?? 'Failed to update status.');
    return;
  }

  await fetchBooks();
}

async function fetchBooks(): Promise<void> {
  const response = await fetch(`${API_BASE}/getBooks`);
  if (!response.ok) {
    throw new Error('Failed to load books.');
  }
  const books = (await response.json()) as Book[];
  renderBooks(books);
}

bookForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(bookForm);
  const payload = Object.fromEntries(formData.entries()) as Record<string, string>;

  const body = {
    ...payload,
    numberOfPages: Number(payload.numberOfPages),
    numberOfPagesRead: Number(payload.numberOfPagesRead),
    price: Number(payload.price)
  };

  const response = await fetch(`${API_BASE}/addBook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = (await response.json()) as { message?: string };
    alert(error.message ?? 'Failed to add book.');
    return;
  }

  bookForm.reset();
  const pagesReadField = bookForm.querySelector('[name="numberOfPagesRead"]') as HTMLInputElement | null;
  if (pagesReadField) {
    pagesReadField.value = '0';
  }
  await fetchBooks();
});

bookListEl.addEventListener('submit', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLFormElement) || !target.hasAttribute('data-update-form')) {
    return;
  }

  event.preventDefault();

  const bookId = target.getAttribute('data-book-id');
  if (!bookId) {
    return;
  }

  const input = target.querySelector('[name="numberOfPagesRead"]') as HTMLInputElement | null;
  const numberOfPagesRead = input ? Number(input.value) : NaN;

  if (Number.isNaN(numberOfPagesRead)) {
    return;
  }

  const response = await fetch(`${API_BASE}/updatePagesRead/${bookId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numberOfPagesRead })
  });

  if (!response.ok) {
    const error = (await response.json()) as { message?: string };
    alert(error.message ?? 'Failed to update pages.');
    return;
  }

  await fetchBooks();
});

fetchBooks().catch((error) => {
  console.error(error);
  alert('Could not load books. Is the server running?');
});
