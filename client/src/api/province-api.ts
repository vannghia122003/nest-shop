import axios from 'axios'

interface IProvince {
  code: number
  name: string
  division_type: string
  codename: string
  phone_code: number
}

interface IDistrict {
  name: string
  code: number
  division_type: string
  codename: string
  province_code: number
}

interface Ward {
  code: number
  name: string
  division_type: string
  codename: string
  district_code: number
}

interface IProvinceDetail extends IProvince {
  districts: IDistrict[]
}

interface IDistrictDetail extends IDistrict {
  wards: Ward[]
}

const provinceApi = {
  getAllProvinces() {
    return axios.get<IProvince[]>('https://provinces.open-api.vn/api/p').then((res) => res.data)
  },
  getProvince(code: number) {
    return axios
      .get<IProvinceDetail>(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
      .then((res) => res.data)
  },
  getDistrict(code: number) {
    return axios
      .get<IDistrictDetail>(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
      .then((res) => res.data)
  }
}

export default provinceApi
