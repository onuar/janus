export default class Collection<T> {
    private _items: any[] = [];

    public GetItems() {
        return this._items;
    }

    public GetItem(index: number): T {
        return this._items[index];
    }

    public Count() { return this._items.length; }

    public Add(item: T) {
        this._items.push(item);
    }

    public Delete(itemIndex: number) {
        this._items.splice(itemIndex, 1);
    }

    public IndexOfItem(obj: T, fromIndex?: number): number {
        if (fromIndex == null) {
            fromIndex = 0;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this._items.length + fromIndex);
        }
        for (var i = fromIndex, j = this._items.length; i < j; i++) {
            if (this._items[i] === obj)
                return i;
        }
        return -1;
    }
}