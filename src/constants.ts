import { constants } from 'fs'

export const REG_ONLYIMG = /\.png|\.jpg|\.jpeg/g
export const REG_GETPATH = /src|=|"|\s|from|'/g
export const REG_MATCHIMG = /src\=(\"|\').*\.(png|jpg|jpeg)(\"|\')|from.*(\"|\').*\.(png|jpg|jpeg)(\"|\')/g

export const { R_OK, W_OK } = constants
