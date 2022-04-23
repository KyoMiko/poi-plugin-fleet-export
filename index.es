import React, { Component } from 'react'
import { Button, TextArea } from "@blueprintjs/core";
import { connect } from 'react-redux'
import { shell } from 'electron'
export const windowMode = false;
export const reactClass = connect(state => ({
    fleets: state.info.fleets,
    ships: state.info.ships,
    equips: state.info.equips,
    airbases: state.info.airbase
}))(class view extends Component {

    state = { result: "" };

    exportFleet = () => {
        //读取舰队信息
        const fleets = this.props.fleets;
        //读取船只信息
        const ships = this.props.ships;
        //读取装备信息
        const equips = this.props.equips;
        //读取陆航信息
        const airbases = this.props.airbases;
        //初始化字符串
        let result = `{"version": 4,`;

        //遍历母港中的舰队并且生成json
        for (let i = 0; i < fleets.length; i++) {
            const fleet = fleets[i];
            result += `"f${i + 1}":{`;
            //遍历舰队中的中船只
            for (let j = 0; j < fleet.api_ship.length; j++) {
                if (ships[fleet.api_ship[j]]) {
                    const ship = ships[fleet.api_ship[j]];
                    result += `"s${j + 1}":{"id":${ship.api_ship_id},"lv":${ship.api_lv},"luck":${ship.api_lucky[0]},"items":{`;
                    //遍历船只的装备
                    for (let k = 0; k < ship.api_slot.length; k++) {
                        const slot = ship.api_slot[k];
                        if (equips[slot]) {
                            const equip = equips[slot];
                            result += `"i${k + 1}":{"id":${equip.api_slotitem_id},"rf":${equip.api_level}`
                            if (equip.api_alv) {
                                result += `,"mas":${equip.api_alv}`
                            }
                            result += `},`
                        }
                    }
                    //查看是否存在额外装备（孔）
                    if (equips[ship.api_slot_ex]) {
                        const equip = equips[ship.api_slot_ex]
                        result += `"ix":{"id":${equip.api_slotitem_id},"rf":${equip.api_level}`
                        if (equip.api_alv) {
                            result += `,"mas":${equip.api_alv}`
                        }
                        result += `}`
                    }
                    //去除最后的逗号并且补上items的后括号
                    if (result.charAt(result.length - 1) == ',') {
                        result = result.slice(0, result.length - 1) + `}`
                    } else {
                        result += `}`
                    }
                    //补上ships的后括号
                    result += `},`
                }
            }
            //去除最后的逗号并且补上fleets的后括号
            if (result.charAt(result.length - 1) == ',') {
                result = result.slice(0, result.length - 1) + `},`
            } else {
                result += `},`
            }
        }
        //遍历陆航中的航空中队
        for (let i = 0; i < airbases.length; i++) {
            const airbase = airbases[i];
            result += `"a${i + 1}":{"items": {`;
            //遍历航空中队中的飞机
            for (let j = 0; j < airbase.api_plane_info.length; j++) {
                const plane = airbase.api_plane_info[j];
                if (equips[plane.api_slotid]) {
                    const equip = equips[plane.api_slotid]
                    result += `"i${j + 1}":{"id":${equip.api_slotitem_id},"rf":${equip.api_level}`
                    if (equip.api_alv) {
                        result += `,"mas":${equip.api_alv}`
                    }
                    result += `},`
                }
            }
            //去除最后的逗号并且补上items的后括号
            if (result.charAt(result.length - 1) == ',') {
                result = result.slice(0, result.length - 1) + `},`
            } else {
                result += `},`
            }
            //加上航空中队的行动状态
            result += `"mode":${airbase.api_action_kind}},`
        }
        //去除最后的逗号并且补上json字符串的后括号
        if (result.charAt(result.length - 1) == ',') {
            result = result.slice(0, result.length - 1) + `}`
        } else {
            result += `}`
        }
        //更新result
        this.setState({ result })
        return result;
    }

    exportNoro6 = () => {
        const result = this.exportFleet()
        shell.openExternal(`https://noro6.github.io/kcTools/simulator/?predeck=${encodeURIComponent(result)}`)
    }

    exportJervis = () => {
        const result = this.exportFleet()
        shell.openExternal(`https://jervis.vercel.app/zh-CN/?predeck=${encodeURIComponent(result)}`)
    }

    render() {
        const result = this.state.result;
        return (
            <div>
                <Button onClick={this.exportNoro6}>
                    导出至noro6
                </Button>
                <Button onClick={this.exportJervis}>
                    导出至jervis
                </Button>
                <Button onClick={this.exportFleet}>
                    刷新舰队导出文本
                </Button>
                <br></br>
                <h2>舰队导出文本</h2>
                <TextArea style={{ width: "100%", height: "100px" }} className=":readonly" value={result} ></TextArea>
            </div>
        )
    }
})