import { constants } from 'fs'

export const REG_ONLYIMG = /\.png|\.jpg/g;
export const REG_GETPATH = /src|=|"|\s|from|'/g;
export const REG_MATCHIMG = /src\=(\"|\').*\.(png|jpg)(\"|\')|from.*(\"|\').*\.(png|jpg)(\"|\')/g;

export const { R_OK, W_OK} = constants