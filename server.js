const express = require('express')
const { ObjectId } = require('mongodb')
const { connectDB, getDB } = require('./db')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// 자동차 목록 초기 데이터를 메모리에 저장합니다.
let cars = [
  { _id: 1, name: 'Sonata', price: 2500, company: 'HYUNDAI', year: 2023 },
  { _id: 2, name: 'K5', price: 2700, company: 'KIA', year: 2024 },
  { _id: 3, name: 'SM6', price: 2300, company: 'RENAULT', year: 2022 },
];

// GET / 요청이 오면 "Hello Codex"라는 문자열을 응답합니다.
app.get('/', (req, res) => {
  res.send('Hello Codex');
});

// 전체 자동차 목록을 JSON으로 응답합니다.
app.get('/cars', (req, res) => {
  res.json(cars);
});

// company 쿼리 값과 일치하는 자동차 목록을 검색합니다.
app.get('/cars/search', async (req, res) => {
  const db = getDB()
  const cars = db.collection('cars')

  const { company } = req.query

  const query = {}

  if (company) {
    query.company = company.toUpperCase()
  }

  const carList = await cars.find(query).toArray()

  res.json(carList)
})

// minPrice, maxPrice 쿼리 값으로 자동차 가격 범위를 필터링합니다.
app.get('/cars/filter', async (req, res) => {
  console.log('GET /cars/filter 요청:', req.query)

  const db = getDB()
  const cars = db.collection('cars')

  const { minPrice, maxPrice } = req.query

  const query = {}

  if (minPrice || maxPrice) {
    query.price = {}

    if (minPrice) {
      query.price.$gte = Number(minPrice)
    }

    if (maxPrice) {
      query.price.$lte = Number(maxPrice)
    }
  }

  const carList = await cars.find(query).toArray()

  console.log('조회 결과 개수:', carList.length)

  res.json(carList)
})

// 요청한 id에 해당하는 자동차 한 대를 조회합니다.
app.get('/cars/:id', async (req, res) => {
  console.log('>>>>>>>>>> /cars/:id');
  const db = getDB()
  const cars = db.collection('cars')

  const car = await cars.findOne({
    _id: new ObjectId(req.params.id)
  })

  if (!car) {
    return res.status(404).json({
      message: '자동차 정보를 찾을 수 없습니다.'
    })
  }

  res.json(car)
})

// 요청 body로 전달된 자동차 정보를 목록에 추가합니다.
app.post('/cars', async (req, res) => {
  const db = getDB()
  const cars = db.collection('cars')

  const { name, price, company, year } = req.body

  if (!name || !price || !company || !year) {
    return res.status(400).json({
      message: 'name, price, company, year 값이 필요합니다.'
    })
  }

  const newCar = {
    name,
    price: Number(price),
    company,
    year: Number(year)
  }

  const result = await cars.insertOne(newCar)

  res.status(201).json({
    message: '자동차 등록 완료',
    insertedId: result.insertedId
  })
})

// 요청한 id에 해당하는 자동차 정보를 수정합니다.
app.put('/cars/:id', async (req, res) => {
  const db = getDB()
  const cars = db.collection('cars')

  const { name, price, company, year } = req.body

  const updateData = {}

  if (name !== undefined) updateData.name = name
  if (price !== undefined) updateData.price = Number(price)
  if (company !== undefined) updateData.company = company
  if (year !== undefined) updateData.year = Number(year)

  const result = await cars.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: updateData }
  )

  if (result.matchedCount === 0) {
    return res.status(404).json({
      message: '수정할 자동차 정보를 찾을 수 없습니다.'
    })
  }

  res.json({
    message: '자동차 수정 완료',
    modifiedCount: result.modifiedCount
  })
})

// 요청한 id에 해당하는 자동차 정보를 삭제합니다.
app.delete('/cars/:id', async (req, res) => {
  const db = getDB()
  const cars = db.collection('cars')

  const result = await cars.deleteOne({
    _id: new ObjectId(req.params.id)
  })

  if (result.deletedCount === 0) {
    return res.status(404).json({
      message: '삭제할 자동차 정보를 찾을 수 없습니다.'
    })
  }

  res.json({
    message: '자동차 삭제 완료',
    deletedCount: result.deletedCount
  })
})

app.post('/cars/seed', async (req, res) => {
  const db = getDB()
  const cars = db.collection('cars')

  await cars.deleteMany({})

  const result = await cars.insertMany([
    { name: 'Sonata', price: 2500, company: 'HYUNDAI', year: 2023 },
    { name: 'Avante', price: 1800, company: 'HYUNDAI', year: 2022 },
    { name: 'K5', price: 2700, company: 'KIA', year: 2023 },
    { name: 'K7', price: 3200, company: 'KIA', year: 2021 },
    { name: 'SM6', price: 2100, company: 'RENAULT', year: 2020 }
  ])

  res.json({
    message: '초기 데이터 저장 완료',
    insertedCount: result.insertedCount
  })
})

const path = require('path')

// React 빌드 파일 제공
app.use(express.static(path.join(__dirname, 'client', 'dist')))

// React Router 대비용 fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

// 3000번 포트에서 서버를 실행합니다.
//app.listen(port, () => {
//  console.log(`Server is running on port ${port}`);
//});

async function startServer() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`)
  })
}

startServer()