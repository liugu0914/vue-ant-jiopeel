export default {
  methods: {
    /**
     * 合并单元格
     * @date 2021-05-25 17:11:00
     * @author zxp
     */
    rowSpan(data, key) {
      return data
        .reduce((result, item) => {
          if (result.indexOf(item[key]) < 0) {
            result.push(item[key])
          }
          return result
        }, [])
        .reduce((result, keys) => {
          const children = data.filter((item) => item[key] === keys)
          result = result.concat(
            children.map((item, index) => ({
              ...item,
              [`${key}RowSpan`]: index === 0 ? children.length : 0
            }))
          )
          return result
        }, [])
    }
  }
}
