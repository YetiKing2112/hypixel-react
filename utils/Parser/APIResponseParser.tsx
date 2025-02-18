import api from '../../api/ApiHelper'
import { NotificationListener, SubscriptionType } from '../../api/ApiTypes.d'
import { hasFlag } from '../../components/FilterElement/FilterType'
import { getFlipFinders } from '../FlipUtils'
import { convertTagToName } from '../Formatter'

export function parseItemBidForList(bid: any): BidForList {
    return {
        uuid: bid.uuid || bid.auctionId,
        end: parseDate(bid.end),
        item: {
            name: bid.itemName,
            tag: bid.tag
        },
        highestBid: bid.highestBid,
        highestOwn: bid.highestOwnBid,
        bin: bid.bin
    } as BidForList
}

export function parseItemBid(bid: any): ItemBid {
    return {
        auctionId: bid.auctionId,
        amount: bid.amount,
        bidder: parsePlayer(bid.bidder),
        timestamp: parseDate(bid.timestamp),
        profileId: bid.profileId,
        bin: bid.bin
    } as ItemBid
}

export function parseAuction(auction: any): Auction {
    let parsedAuction = {
        uuid: auction.uuid || auction.auctionId,
        end: parseDate(auction.end),
        item: {
            tag: auction.tag,
            name: auction.itemName || auction.name
        },
        startingBid: auction.startingBid,
        highestBid: auction.highestBid,
        bin: auction.bin
    } as Auction

    parsedAuction.item.iconUrl = api.getItemImageUrl(parsedAuction.item)

    return parsedAuction
}

export function parsePlayerDetails(playerDetails: any): PlayerDetails {
    return {
        bids: playerDetails.bids.map(bid => {
            return {
                uuid: bid.uuid,
                highestOwn: bid.highestOwn,
                end: parseDate(bid.end),
                highestBid: bid.highestBid,
                item: {
                    tag: bid.tag,
                    name: bid.itemName
                }
            } as BidForList
        }),
        auctions: playerDetails.auctions.map(auction => {
            return {
                uuid: auction.auctionId,
                highestBid: auction.highestBid,
                end: parseDate(auction.end),
                item: {
                    tag: auction.tag,
                    name: auction.itemName
                },
                bin: auction.bin
            } as Auction
        })
    } as PlayerDetails
}

export function parseItemPrice(priceData: any): ItemPrice {
    return {
        time: parseDate(priceData.time),
        avg: priceData.avg,
        max: priceData.max,
        min: priceData.min,
        volume: priceData.volume
    } as ItemPrice
}

export function parseItem(item: any): Item {
    const CRAB_HAT_IMAGES = {
        red: 'https://mc-heads.net/head/56b61f826dd6bfc1e3191a8369aeb0435c5a5335563431a538585ad039da1e0c',
        orange: 'https://mc-heads.net/head/ae38a15704089676a24e9eeccf4c290644d352c7d8f2b4135fa3538625107db',
        yellow: 'https://mc-heads.net/head/6b92684647051bd27ee04adb4098ee9bccca45a726a7cbf38e98b7e75cb889f4',
        lime: 'https://mc-heads.net/head/993c60fd0dd130695e378eef010a7d3c5dfde77f6b82b20b8124cfb830017ff',
        green: 'https://mc-heads.net/head/98d99983ab5986921251a29bba96c8e734f5de084a296cb627bcd64fd0fba593',
        aqua: 'https://mc-heads.net/head/2e1556958b1df4fd6228c9dcbd8c053f5d8902a41c4a59376bd0df1c60be8369',
        purple: 'https://mc-heads.net/head/2e3af5824014b57f4a4a84d4bb7fb88cac9e4ac75d00c7adb09dfe5ab737e224',
        pink: 'https://mc-heads.net/head/effaf0dc89da58bd1ed08f917407853e58d7bcbf5e6b5f33586389eb863a5bbd',
        black: 'https://mc-heads.net/head/cb85828267e59e83edc3bef235102e43fb70922622ccc3809a326a8c5632199a'
    }

    const BALLOON_HAT_IMAGES = {
        red: 'https://mc-heads.net/head/567f93963ad7ac3abdc49d02c9861fa2d45d00da1a7b31193ceb246313d39bc5',
        orange: 'https://mc-heads.net/head/841c5e8e0637acee09b68fab743db66c6714938c73792bc95acb1f393478144b',
        yellow: 'https://mc-heads.net/head/a90d9adef4732e5832448973e3557fce8a2e9ec8129ed32143eb666b4fa88ab2',
        lime: 'https://mc-heads.net/head/fb0209c346e04c3253f492ab904ef6e472faa617c681706f9153a116aa6481c2',
        green: 'https://mc-heads.net/head/8ba968d27dd90f67434e818646b2b0042946b67a14c594b31698dae309cb52a4',
        aqua: 'https://mc-heads.net/head/6432dda190146d4ad7a8569b389aea777684c44fa2624dcf74016467765e9693',
        purple: 'https://mc-heads.net/head/98b97944067281fa1361aa43ac522fdf190e50d65479f89a35e8cf87154e005c',
        pink: 'https://mc-heads.net/head/2ad4c874756ab9672aec51d53b9b94e6c9b5c6e7e0a2d44928df2186f4791e96',
        black: 'https://mc-heads.net/head/63bdb1e21a9fdf98aff67f0ff4e7dfada05f340210dd70b688c09c3cf50f6410'
    }

    let parsed = {
        tag: item.tag,
        name: item.altNames && item.altNames[0] && item.altNames[0].Name ? item.altNames[0].Name : item.itemName || item.name,
        category: item.category,
        iconUrl: item.iconUrl || item.icon || api.getItemImageUrl(item),
        tier: item.tier,
        bazaar: hasFlag(item.flags, 1)
    }

    if (item.flatNbt && item.flatNbt['party_hat_color'] && item.tag === 'PARTY_HAT_CRAB') {
        parsed.iconUrl = CRAB_HAT_IMAGES[item.flatNbt['party_hat_color']] || parsed.iconUrl
    }
    if (item.flatNbt && item.flatNbt['party_hat_color'] && item.tag === 'BALLOON_HAT_2024') {
        parsed.iconUrl = BALLOON_HAT_IMAGES[item.flatNbt['party_hat_color']] || parsed.iconUrl
    }

    return parsed
}

export function parseEnchantment(enchantment: any): Enchantment {
    return {
        id: enchantment.id,
        level: enchantment.level,
        name: enchantment.type ? convertTagToName(enchantment.type) : '',
        color: enchantment.color
    }
}

export function parseSearchResultItem(item: any): SearchResultItem {
    let _getRoute = (): string => {
        switch (item.type) {
            case 'filter':
                return '/item/' + item.id.split('?')[0]
            case 'item':
                return '/item/' + item.id
            case 'player':
                return '/player/' + item.id
            case 'auction':
                return '/auction/' + item.id
        }
        return ''
    }

    return {
        dataItem: {
            name: item.name,
            iconUrl: item.img ? 'data:image/png;base64,' + item.img : item.type === 'item' ? item.iconUrl : item.iconUrl + '?size=8'
        },
        type: item.type,
        route: _getRoute(),
        urlSearchParams: item.type === 'filter' ? new URLSearchParams(item.id.split('?')[1] + '&apply=true') : undefined,
        id: item.id,
        tier: item.tier
    }
}

export function parsePlayer(player: any): Player {
    if (typeof player === 'string') {
        player = {
            uuid: player,
            name: player
        }
    }
    return {
        name: player.name,
        uuid: player.uuid,
        iconUrl: player.iconUrl ? player.iconUrl + '?size=8' : 'https://crafatar.com/avatars/' + player.uuid + '?size=8'
    }
}

export function parseAuctionDetails(auctionDetails: any): AuctionDetails {
    return {
        auction: {
            uuid: auctionDetails.uuid,
            end: parseDate(auctionDetails.end),
            highestBid: auctionDetails.highestBidAmount,
            startingBid: auctionDetails.startingBid,
            item: parseItem(auctionDetails),
            bin: auctionDetails.bin
        },
        start: parseDate(auctionDetails.start),
        anvilUses: auctionDetails.anvilUses,
        auctioneer: parsePlayer(auctionDetails.auctioneer),
        bids: auctionDetails.bids.map(bid => {
            return parseItemBid(bid)
        }),
        claimed: auctionDetails.claimed,
        coop: auctionDetails.coop,
        count: auctionDetails.count,
        enchantments: auctionDetails.enchantments.map(enchantment => {
            return parseEnchantment(enchantment)
        }),
        profileId: auctionDetails.profileId,
        reforge: auctionDetails.reforge,
        nbtData: auctionDetails.flatNbt ? auctionDetails.flatNbt : undefined,
        itemCreatedAt: parseDate(auctionDetails.itemCreatedAt),
        uuid: auctionDetails.uuid
    }
}

export function parseSubscriptionTypes(typeInNumeric: number): SubscriptionType[] {
    let keys = Object.keys(SubscriptionType)
    let subTypes: SubscriptionType[] = []

    for (let i = keys.length; i >= 0; i--) {
        let enumValue = SubscriptionType[keys[i]]
        if (typeof SubscriptionType[enumValue] === 'number') {
            let number = parseInt(SubscriptionType[enumValue])
            if (number <= typeInNumeric && number > 0) {
                typeInNumeric -= number
                subTypes.push(SubscriptionType[number.toString()])
            }
        }
    }

    return subTypes
}

function _getTypeFromSubTypes(subTypes: SubscriptionType[]): 'item' | 'player' | 'auction' {
    let type
    switch (SubscriptionType[subTypes[0].toString()]) {
        case SubscriptionType.BIN:
        case SubscriptionType.PRICE_HIGHER_THAN:
        case SubscriptionType.PRICE_LOWER_THAN:
            type = 'item'
            break
        case SubscriptionType.OUTBID:
        case SubscriptionType.SOLD:
        case SubscriptionType.PLAYER_CREATES_AUCTION:
            type = 'player'
            break
        case SubscriptionType.AUCTION:
            type = 'auction'
            break
    }
    return type
}

export function parseSubscription(subscription: any): NotificationListener {
    return {
        id: subscription.id,
        price: subscription.price,
        topicId: subscription.topicId,
        types: parseSubscriptionTypes(subscription.type),
        type: _getTypeFromSubTypes(parseSubscriptionTypes(subscription.type)),
        filter: subscription.filter ? JSON.parse(subscription.filter) : undefined
    }
}

export function parseProducts(products: any): Product[] {
    return products.map((product: any) => {
        return {
            productId: product.slug,
            description: product.description,
            title: product.title,
            ownershipSeconds: product.ownershipSeconds,
            cost: product.cost
        } as Product
    })
}

export function parseRecentAuction(auction): RecentAuction {
    return {
        end: parseDate(auction.end),
        playerName: auction.playerName,
        price: auction.price,
        seller: parsePlayer(auction.seller),
        uuid: auction.uuid
    }
}

export function parseFlipAuction(flip): FlipAuction {
    let parsedFlip = {
        showLink: true,
        median: flip.median,
        cost: flip.cost,
        uuid: flip.uuid,
        volume: flip.volume,
        bin: flip.bin,
        item: {
            tag: flip.tag,
            name: flip.name,
            tier: flip.tier
        },
        secondLowestBin: flip.secondLowestBin,
        sold: flip.sold,
        sellerName: flip.sellerName,
        lowestBin: flip.lowestBin,
        props: flip.prop,
        finder: flip.finder,
        profit: flip.Profit
    } as FlipAuction
    parsedFlip.item.iconUrl = api.getItemImageUrl(parsedFlip.item)

    return parsedFlip
}

export function parsePopularSearch(search): PopularSearch {
    return {
        title: search.title,
        url: search.url,
        img: search.img
    }
}

export function parseRefInfo(refInfo): RefInfo {
    return {
        oldInfo: {
            refId: refInfo.oldInfo.refId,
            count: refInfo.oldInfo.count,
            receivedHours: refInfo.oldInfo.receivedHours,
            receivedTime: refInfo.oldInfo.receivedTime,
            bougthPremium: refInfo.oldInfo.bougthPremium
        },
        purchasedCoins: refInfo.purchasedCoins,
        referedCount: refInfo.referedCount,
        validatedMinecraft: refInfo.validatedMinecraft,
        referredBy: refInfo.referredBy
    }
}

export function parseFilterOption(filterOption): FilterOptions {
    return {
        name: filterOption.name,
        options: filterOption.options,
        type: filterOption.type,
        description: filterOption.description
    }
}

export function parseAccountInfo(accountInfo): AccountInfo {
    return {
        email: accountInfo.email,
        mcId: accountInfo.mcId,
        mcName: accountInfo.mcName,
        token: accountInfo.token
    }
}

export function parseMinecraftConnectionInfo(minecraftConnectionInfo): MinecraftConnectionInfo {
    return {
        code: minecraftConnectionInfo.code,
        isConnected: minecraftConnectionInfo.isConnected
    }
}

export function parseDate(dateString: string) {
    if (!dateString) {
        return new Date()
    }
    if (typeof dateString === 'object' && typeof (dateString as any).getTime === 'function') {
        dateString = (dateString as Date).toISOString()
    }
    if (dateString.slice(-1) === 'Z') {
        return new Date(dateString)
    }
    return new Date(dateString + 'Z')
}

export function parseProfitableCrafts(crafts: any[] = []): ProfitableCraft[] {
    let parseCraftIngredient = (ingredient: any): CraftingIngredient => {
        let result = {
            cost: ingredient.cost,
            count: ingredient.count,
            type: ingredient.type,
            item: {
                tag: ingredient.itemId
            }
        } as CraftingIngredient

        result.item.name = convertTagToName(result.item.tag)
        result.item.iconUrl = api.getItemImageUrl(result.item)
        if (result.type === 'craft') {
            let toCraft = crafts.find(craft => craft.itemId === result.item.tag)
            if (!toCraft) {
                console.log(`craft not found for ${JSON.stringify(result)}`)
                return result
            }
            result.ingredients = toCraft.ingredients.map(parseCraftIngredient)
        }
        return result
    }

    return crafts.map(craft => {
        let c = {
            item: {
                tag: craft.itemId,
                name: craft.itemName
            },
            craftCost: craft.craftCost,
            sellPrice: craft.sellPrice,
            ingredients: craft.ingredients.map(parseCraftIngredient),
            median: craft.median,
            volume: craft.volume,
            requiredCollection: craft.reqCollection
                ? {
                      name: craft.reqCollection.name,
                      level: craft.reqCollection.level
                  }
                : null,
            requiredSlayer: craft.reqSlayer
                ? {
                      name: craft.reqSlayer.name,
                      level: craft.reqSlayer.level
                  }
                : null
        } as ProfitableCraft
        c.item.name = convertTagToName(c.item.name)
        c.item.iconUrl = api.getItemImageUrl(c.item)

        return c
    })
}

export function parseLowSupplyItem(item): LowSupplyItem {
    let lowSupplyItem = parseItem(item) as LowSupplyItem
    lowSupplyItem.supply = item.supply
    lowSupplyItem.medianPrice = item.median
    lowSupplyItem.volume = item.volume
    lowSupplyItem.iconUrl = api.getItemImageUrl(item)
    lowSupplyItem.name = convertTagToName(item.tag)
    return lowSupplyItem
}

export function parseSkyblockProfile(profile): SkyblockProfile {
    return {
        current: profile.current,
        cuteName: profile.cute_name,
        id: profile.profile_id
    }
}

export function parseCraftingRecipe(recipe): CraftingRecipe {
    return {
        A1: parseCraftingRecipeSlot(recipe.A1),
        A2: parseCraftingRecipeSlot(recipe.A2),
        A3: parseCraftingRecipeSlot(recipe.A3),
        B1: parseCraftingRecipeSlot(recipe.B1),
        B2: parseCraftingRecipeSlot(recipe.B2),
        B3: parseCraftingRecipeSlot(recipe.B3),
        C1: parseCraftingRecipeSlot(recipe.C1),
        C2: parseCraftingRecipeSlot(recipe.C2),
        C3: parseCraftingRecipeSlot(recipe.C3)
    }
}

// parses a crafting recipe slot string into a CraftingRecipeSlot object
// example input: "ENCHANTED_EYE_OF_ENDER:16"
export function parseCraftingRecipeSlot(craftingRecipeSlotString: string): CraftingRecipeSlot | undefined {
    if (!craftingRecipeSlotString) return undefined
    let count = parseInt(craftingRecipeSlotString.split(':')[1])
    return {
        tag: craftingRecipeSlotString.split(':')[0],
        count: count || 0
    }
}

export function parseItemSummary(price): ItemPriceSummary {
    return {
        max: price.max,
        mean: price.mean,
        median: price.median,
        min: price.min,
        mode: price.mode,
        volume: price.volume
    }
}

export function parsePaymentResponse(payment): PaymentResponse {
    return {
        id: payment.id,
        directLink: payment.dirctLink
    } as PaymentResponse
}

export function parseKatFlip(katFlip): KatFlip {
    let flip = {
        coreData: {
            amount: katFlip.coreData.amount,
            cost: katFlip.coreData.cost,
            hours: katFlip.coreData.hours,
            item: {
                tag: katFlip.coreData.itemTag,
                name: katFlip.coreData.name,
                tier: katFlip.coreData.baseRarity
            },
            material: katFlip.coreData.material
        },
        cost: katFlip.purchaseCost + katFlip.materialCost + katFlip.upgradeCost,
        purchaseCost: katFlip.purchaseCost,
        materialCost: katFlip.materialCost,
        median: katFlip.median,
        originAuctionUUID: katFlip.originAuction,
        profit: katFlip.profit,
        referenceAuctionUUID: katFlip.referenceAuction,
        targetRarity: katFlip.targetRarity,
        upgradeCost: katFlip.upgradeCost,
        volume: katFlip.volume,
        originAuctionName: katFlip.originAuctionName
    } as KatFlip
    flip.coreData.item.iconUrl = api.getItemImageUrl(flip.coreData.item)
    return flip
}

export function parseFlipTrackingFlip(flip): FlipTrackingFlip {
    let flipTrackingFlip = {
        item: {
            tag: flip?.itemTag,
            name: flip?.itemName || flip?.itemTag || '---',
            tier: flip?.tier
        },
        originAuction: flip?.originAuction,
        pricePaid: flip?.pricePaid,
        soldAuction: flip?.soldAuction,
        soldFor: flip?.soldFor,
        uId: flip?.uId,
        finder: getFlipFinders([flip.finder || 0])[0],
        sellTime: parseDate(flip?.sellTime),
        buyTime: parseDate(flip?.buyTime),
        profit: flip?.profit,
        propertyChanges: flip.propertyChanges?.map(change => {
            return {
                description: change.description,
                effect: change.effect
            }
        }),
        flags: flip.flags ? new Set(flip.flags.split(', ')) : new Set()
    } as FlipTrackingFlip
    flipTrackingFlip.item.iconUrl = api.getItemImageUrl(flipTrackingFlip?.item)
    return flipTrackingFlip
}

export function parseBazaarOrder(order): BazaarOrder {
    return {
        amount: order.amount,
        pricePerUnit: order.pricePerUnit,
        orders: order.orders
    }
}

export function parseBazaarSnapshot(snapshot): BazaarSnapshot {
    return {
        item: parseItem({ tag: snapshot.productId }),
        buyData: {
            orderCount: snapshot.buyOrdersCount,
            price: snapshot.buyPrice,
            volume: snapshot.buyVolume,
            moving: snapshot.buyMovingWeek
        },
        sellData: {
            orderCount: snapshot.sellOrdersCount,
            price: snapshot.sellPrice,
            volume: snapshot.sellVolume,
            moving: snapshot.sellMovingWeek
        },
        timeStamp: parseDate(snapshot.timeStamp),
        buyOrders: snapshot.buyOrders.map(parseBazaarOrder),
        sellOrders: snapshot.sellOrders.map(parseBazaarOrder)
    }
}

export function parseFlipTrackingResponse(flipTrackingResponse): FlipTrackingResponse {
    return {
        flips: flipTrackingResponse?.flips ? flipTrackingResponse.flips.map(parseFlipTrackingFlip) : [],
        totalProfit: flipTrackingResponse?.totalProfit || 0
    }
}

export function parseBazaarPrice(bazaarPrice): BazaarPrice {
    return {
        buyData: {
            max: bazaarPrice.maxBuy || 0,
            min: bazaarPrice.minBuy || 0,
            price: bazaarPrice.buy || 0,
            volume: bazaarPrice.buyVolume || 0,
            moving: bazaarPrice.buyMovingWeek || 0
        },
        sellData: {
            max: bazaarPrice.maxSell || 0,
            min: bazaarPrice.minSell || 0,
            price: bazaarPrice.sell || 0,
            volume: bazaarPrice.sellVolume || 0,
            moving: bazaarPrice.sellMovingWeek || 0
        },
        timestamp: parseDate(bazaarPrice.timestamp)
    }
}

export function parsePrivacySettings(privacySettings): PrivacySettings {
    return {
        allowProxy: privacySettings.allowProxy,
        autoStart: privacySettings.autoStart,
        chatRegex: privacySettings.chatRegex,
        collectChat: privacySettings.collectChat,
        collectChatClicks: privacySettings.collectChatClicks,
        collectEntities: privacySettings.collectEntities,
        collectInvClick: privacySettings.collectInvClick,
        collectInventory: privacySettings.collectInventory,
        collectLobbyChanges: privacySettings.collectLobbyChanges,
        collectScoreboard: privacySettings.collectScoreboard,
        collectTab: privacySettings.collectTab,
        commandPrefixes: privacySettings.commandPrefixes,
        extendDescriptions: privacySettings.extendDescriptions
    }
}

export function parsePremiumProducts(productsObject): PremiumProduct[] {
    let products: PremiumProduct[] = []
    Object.keys(productsObject).forEach(key => {
        products.push({
            productSlug: key,
            expires: parseDate(productsObject[key].expiresAt)
        })
    })
    return products
}

export function parseMayorData(mayorData): MayorData {
    return {
        end: parseDate(mayorData.end),
        start: parseDate(mayorData.start),
        winner: mayorData.winner,
        year: mayorData.yearF
    }
}

export function parseInventoryData(data): InventoryData {
    if (data === null || data.itemName === null) {
        return data
    }

    if (data.enchantments !== null) {
        Object.keys(data?.enchantments).forEach(key => {
            data.enchantments[key] = data.enchantments[key].toString()
        })
    }

    return {
        color: data.data,
        count: data.count,
        description: data.description,
        enchantments: data.enchantments || {},
        extraAttributes: data.extraAttributes,
        icon: api.getItemImageUrl({ tag: data.tag }),
        id: data.id,
        itemName: data.itemName,
        tag: data.tag
    }
}

export function parseTradeObject(data): TradeObject {
    return {
        id: data.id,
        playerUuid: data.playerUuid,
        playerName: data.playerName,
        buyerUuid: data.buyerUuid,
        item: parseInventoryData(data.item),
        wantedItems: data.wantedItems ? data.wantedItems.filter(wantedItem => wantedItem.tag !== 'SKYBLOCK_COIN') : [],
        wantedCoins: data.wantedItems ? data.wantedItems.find(wantedItem => wantedItem.tag === 'SKYBLOCK_COIN')?.filters?.Count : null,
        timestamp: parseDate(data.timestamp),
        coins: data.coins
    }
}

export function parseTransaction(transaction): Transaction {
    return {
        productId: transaction.productId,
        reference: transaction.reference,
        amount: transaction.amount,
        timeStamp: parseDate(transaction.timeStamp)
    }
}

export function parseOwnerHistory(ownerHistory): OwnerHistory {
    return {
        buyer: parsePlayer(ownerHistory.buyer),
        seller: parsePlayer(ownerHistory.seller),
        highestBid: ownerHistory.highestBid,
        itemTag: ownerHistory.itemTag,
        uuid: ownerHistory.uuid,
        timestamp: parseDate(ownerHistory.timestamp)
    }
}

export function parseArchivedAuctions(archivedAuctionsResponse: any): ArchivedAuctionResponse {
    return {
        queryStatus: archivedAuctionsResponse.queryStatus,
        auctions: archivedAuctionsResponse.auctions.map(a => {
            return {
                end: parseDate(a.end),
                price: a.price,
                seller: parsePlayer({
                    name: a.playerName,
                    uuid: a.seller
                }),
                uuid: a.uuid
            } as ArchivedAuction
        })
    }
}
