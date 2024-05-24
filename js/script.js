const books = [];
const RENDER_EVENT = 'render-books';
const STORAGE_KEY = 'book-app';
const SAVED_EVENT = 'saved-book';

function generateId() {
    return +new Date();
}

function makeBooksObject(id, title, author, year, isComplete) {
    return{
        id,
        title,
        author,
        year,
        isComplete
    }
}

function addBook() {
    const inputJudul = document.getElementById("inputJudul").value;
    const inputPenulis = document.getElementById("inputPenulis").value;
    const inputTahun = parseInt(document.getElementById("inputTahun").value);
    const inputIsComplete = document.getElementById("inputIsCompleted").checked;

    if (books !== null) {
        for(const book of books){
            if(book.title === inputJudul && book.author === inputPenulis && book.year === inputTahun){
                alert("buku sudah ada tidak bisa ditambah lagi");

                document.getElementById("inputJudul").value = '';
                document.getElementById("inputPenulis").value = '';
                document.getElementById("inputTahun").value = '';
                document.getElementById("inputIsCompleted").checked = false;
                
                return;
            }
        }
    }
    

    const Id = generateId();

    const book = makeBooksObject(Id, inputJudul, inputPenulis, inputTahun, inputIsComplete);

    books.push(book);

    document.getElementById("inputJudul").value = '';
    document.getElementById("inputPenulis").value = '';
    document.getElementById("inputTahun").value = '';
    document.getElementById("inputIsCompleted").checked = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
        
    }
    return null;
}

function selesaiMembacaBuku(bookId) { 
    const bookTarget = findBook(bookId);

        if (bookTarget == null) {
            return;
        }
    
        bookTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
}

function bukuBelumDibaca(bookId) {
    const bookTarget = findBook(bookId);

        if (bookTarget == null) {
            return;
        }
    
        bookTarget.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
}

function findBookIndex(BookId) {
    for (const index in books) {
        if (books[index].id === BookId) {
            return index;
        }
    }

    return -1;
}

function hapusBuku(BookId) {
    const bookTarget = findBookIndex(BookId);

    if (bookTarget === -1) {
        return;
    }

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookByJudul(bookName) {
    for (const bookItem of books) {
        if (bookItem.title == bookName) {
            return bookItem;
        }
        
    }
    return null;
}

function makeListBuku(book) {

    const container = document.createElement('div');
    container.classList.add('buku');
    container.setAttribute('id', `book-${book.id}`);

    const judulBuku = document.createElement('p');
    judulBuku.setAttribute('class', 'judulBuku');
    judulBuku.innerText = book.title;

    const penulisBuku = document.createElement('p');
    penulisBuku.setAttribute('class', 'penulis');
    penulisBuku.innerText = `penulis : ${book.author}`;

    const tahun = document.createElement('p');
    tahun.setAttribute('class', 'tahun');
    tahun.innerText = `tahun : ${book.year}`;

    container.append(judulBuku, penulisBuku, tahun);

    if (!book.isComplete) {

        const doneButton = document.createElement('button');
        doneButton.setAttribute('class', 'selesai');
        doneButton.innerText = 'Buku selesai dibaca';

        doneButton.addEventListener("click", function () {
            selesaiMembacaBuku(book.id);
        })
        
        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'hapus');
        deleteButton.innerText = 'Hapus Buku';

        deleteButton.addEventListener("click", function () {
            hapusBuku(book.id);
        })

        container.append(doneButton, deleteButton);

    }else{

        const notDoneButton = document.createElement('button');
        notDoneButton.setAttribute('class', 'belumSelesai');
        notDoneButton.innerText = 'Buku belum selesai dibaca';

        notDoneButton.addEventListener("click", function () {
            bukuBelumDibaca(book.id);
        })
        
        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'hapus');
        deleteButton.innerText = 'Hapus Buku';

        deleteButton.addEventListener("click", function () {
            hapusBuku(book.id);
        })

        container.append(notDoneButton, deleteButton)

    }

    return container;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser anda tidak mendukung local storage");
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for(const book of data){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {

    const tambahBuku = document.getElementById("tambahBuku");
    tambahBuku.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });

    document.addEventListener(RENDER_EVENT, function(){
        const notCompleteBooks = document.querySelector('.NotComplete .list-buku');
        if (notCompleteBooks) {
            notCompleteBooks.innerHTML = '';
        }

        const completeBooks = document.querySelector('.Complete .list-buku');
        if (completeBooks) {
            completeBooks.innerHTML = '';
        }

        for(const book of books){
            const bookElement = makeListBuku(book);
            if (book.isComplete) {
                if (completeBooks) {
                    completeBooks.append(bookElement);
                }
            }else{
                if (notCompleteBooks) {
                    notCompleteBooks.append(bookElement);
                }
            }
        }

    });

    document.addEventListener(SAVED_EVENT, function () {
        console.log(localStorage.getItem(STORAGE_KEY));
    });

    const searchButton = document.querySelector("nav form button");

    searchButton.addEventListener("click", function searchBookByTitle(event) {
        event.preventDefault();
        const searchInput = document.getElementById("search").value;
        const notCompleteBooks = document.querySelector('.NotComplete .list-buku');
        const completeBooks = document.querySelector('.Complete .list-buku');

        if (notCompleteBooks) {
            notCompleteBooks.innerHTML = '';
        }

        if (completeBooks) {
            completeBooks.innerHTML = '';
        }

        for(const book of books){
            if (book.title == searchInput) {
                const bookElement = makeListBuku(book);
                if (completeBooks) {
                    completeBooks.append(bookElement);
                }else{
                    notCompleteBooks.append(bookElement);
                }
            }
        }

        
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

});

    // searchButton.addEventListener("click", function (event) {
    //     event.preventDefault();
    //     const searchInput = document.getElementById("search").value;
    //     const bookTarget = findBookByJudul(searchInput);

    //     if (bookTarget == null) {
    //         return alert("Buku tidak ditemukan");
    //     }

    //     const container = document.createElement('div');
    //     container.classList.add('buku');
    //     container.setAttribute('id', `book-${bookTarget.id}`);

    //     const judulBuku = document.createElement('p');
    //     judulBuku.setAttribute('class', 'judulBuku');
    //     judulBuku.innerText = bookTarget.title;

    //     const penulisBuku = document.createElement('p');
    //     penulisBuku.setAttribute('class', 'penulis');
    //     penulisBuku.innerText = `penulis : ${bookTarget.author}`;

    //     const tahun = document.createElement('p');
    //     tahun.setAttribute('class', 'tahun');
    //     tahun.innerText = `tahun : ${bookTarget.year}`;

    //     container.append(judulBuku, penulisBuku, tahun);

    //     const findBooks = document.querySelector('.koleksiBuku');
    //     findBooks.innerHTML = '';

    //     const hasilCari = document.createElement('div');
    //     hasilCari.classList.add('hasilCari');

    //     const judul = document.createElement('p');
    //     judul.classList.add('judul');
    //     judul.innerText = "Buku yang dicari";

    //     const listBuku = document.createElement('div');
    //     listBuku.classList.add('list-buku');

    //     listBuku.append(container);

    //     hasilCari.append(judul, listBuku);

    //     findBooks.append(hasilCari);

    //     if (!bookTarget.isComplete) {

    //         const doneButton = document.createElement('button');
    //         doneButton.setAttribute('class', 'selesai');
    //         doneButton.innerText = 'Buku selesai dibaca';
    
    //         doneButton.addEventListener("click", function () {
    //             selesaiMembacaBuku(bookTarget.id);
    //         });
            
    //         const deleteButton = document.createElement('button');
    //         deleteButton.setAttribute('class', 'hapus');
    //         deleteButton.innerText = 'Hapus Buku';
    
    //         deleteButton.addEventListener("click", function () {
    //             hapusBuku(bookTarget.id);
    //         });
    
    //         container.append(doneButton, deleteButton);
    
    //     }else{
    
    //         const notDoneButton = document.createElement('button');
    //         notDoneButton.setAttribute('class', 'belumSelesai');
    //         notDoneButton.innerText = 'Buku belum selesai dibaca';
    
    //         notDoneButton.addEventListener("click", function () {
    //             bukuBelumDibaca(bookTarget.id);
    //         });
            
    //         const deleteButton = document.createElement('button');
    //         deleteButton.setAttribute('class', 'hapus');
    //         deleteButton.innerText = 'Hapus Buku';
    
    //         deleteButton.addEventListener("click", function () {
    //             hapusBuku(bookTarget.id);
    //         });
    
    //         container.append(notDoneButton, deleteButton)
    
    //     }

    //     // document.dispatchEvent(new Event(RENDER_EVENT));
    // });

    


