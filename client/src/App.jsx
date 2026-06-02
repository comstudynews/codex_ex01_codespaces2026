import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cars, setCars] = useState([]);
  const [company, setCompany] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCars = async (url) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('자동차 목록을 불러오지 못했습니다.');
      }

      const data = await response.json();
      setCars(data);
    } catch (err) {
      setError(err.message);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCars = () => {
    fetchCars('/cars');
  };

  const searchByCompany = (event) => {
    event.preventDefault();

    const keyword = company.trim().toUpperCase();
    const url = keyword
      ? `/cars/search?company=${encodeURIComponent(keyword)}`
      : '/cars/search';

    fetchCars(url);
  };

  const filterByPrice = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (minPrice) {
      params.append('minPrice', minPrice);
    }

    if (maxPrice) {
      params.append('maxPrice', maxPrice);
    }

    const query = params.toString();
    fetchCars(query ? `/cars/filter?${query}` : '/cars/filter');
  };

  useEffect(() => {
    let ignore = false;

    fetch('/cars')
      .then((response) => {
        if (!response.ok) {
          throw new Error('자동차 목록을 불러오지 못했습니다.');
        }

        return response.json();
      })
      .then((data) => {
        if (!ignore) {
          setCars(data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message);
          setCars([]);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="app">
      <header className="page-header">
        <div>
          <p className="eyebrow">Express REST API</p>
          <h1>자동차 목록</h1>
        </div>
        <button className="secondary-button" type="button" onClick={loadCars}>
          전체 목록
        </button>
      </header>

      <section className="controls" aria-label="자동차 검색과 필터">
        <form className="control-panel" onSubmit={searchByCompany}>
          <h2>회사명 검색</h2>
          <div className="input-row">
            <input
              type="text"
              placeholder="HYUNDAI"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <button type="submit">검색</button>
          </div>
        </form>

        <form className="control-panel" onSubmit={filterByPrice}>
          <h2>가격 필터</h2>
          <div className="input-row price-row">
            <input
              type="number"
              min="0"
              placeholder="최소 가격"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="최대 가격"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button type="submit">필터 적용</button>
          </div>
        </form>
      </section>

      {error && <p className="status error">{error}</p>}
      {loading && <p className="status">자동차 목록을 불러오는 중입니다.</p>}

      {!loading && !error && cars.length === 0 && (
        <p className="status">조건에 맞는 자동차가 없습니다.</p>
      )}

      <section className="car-list" aria-label="자동차 목록">
        {cars.map((car) => (
          <article className="car-card" key={car._id}>
            <div className="card-header">
              <h3>{car.name}</h3>
              <span>{car.company}</span>
            </div>
            <dl>
              <div>
                <dt>연식</dt>
                <dd>{car.year}</dd>
              </div>
              <div>
                <dt>가격</dt>
                <dd>{car.price.toLocaleString()}만원</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
