async function getAllData(url) {
     try {
       const data = await fetch(url)
       const finalData = await data.json()
       return finalData
     } catch (error) {
       throw new Error('can not get your exams')
     }
   }

   async function getDataById(url, id) {
    try {
      const data = await fetch(`${url}/${id}`)
      const finalData = await data.json()
      return finalData
    } catch (error) {
      if (data.status === 404) return undefined
      throw new Error('can not get your finalData')
    }
  }

   export { getAllData, getDataById }