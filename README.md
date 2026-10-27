# anatomy-draw（仮称 AnatoDraw）

解剖の「なぞり描き／ノード接続」学習アプリの構想・試作。
Instanatomy（群衆参加型タグ付けアプリ）の姉妹。科研費 25K15370「CloudCrowdAnatomy」構想の
「手を動かす学習」要素を担う。スマホで完結する Web アプリを目指す。

> このフォルダはそのまま新リポジトリのルートにコピーして出発点にできる。

## 中身

| ファイル | 役割 |
|----------|------|
| `DESIGN.md` | 構想・設計ドキュメント（全体像／段階 Level1〜3／データモデル／採点／nanatex 活用／Level1 詳細仕様） |
| `data/aortic-arch.json` | お手本データ第1号（大動脈弓の分枝）。正規化座標 0–1。 |
| `prototype.html` | Level1 なぞり描きの最小プロトタイプ（SVG＋Pointer Events＋カバー率採点）。単一ファイル完結。 |

## 動かし方（ローカル）

`prototype.html` は JSON を `fetch` で読むため、**ローカルサーバー経由で開くこと**
（`file://` で直接開くと JSON が読めない）。

```bash
cd anatomy-draw   # このフォルダ
python3 -m http.server 8010
```

→ ブラウザで <http://localhost:8010/prototype.html>

- 指（またはマウス）でお手本の線をなぞる → 「採点」でカバー率スコア。
- 「やり直す」でリセット。
- スマホ実機で試すときは、PC と同じ Wi-Fi で `http://<PCのIP>:8010/prototype.html` を開く。

## 題材を増やす

`data/` に JSON をもう1つ作るだけ（UI・採点コードは共通）。スキーマは `DESIGN.md` の
「L1-3 データスキーマ」を参照。次の候補は腹大動脈の分枝（腹腔・上腸間膜・腎・性腺・下腸間膜）。
※ `prototype.html` の `PROBLEM_URL` を差し替えれば別題材を表示できる（題材選択 UI は今後）。

## 次の一歩（Level1 マイルストーン / DESIGN L1-6）

1. 大動脈弓 1 題で「なぞる→カバー率→緑/灰で可視化」を実機で快適に。
2. 座標を実機で見ながら解剖学的に微調整。
3. 腹大動脈 JSON を足して「題材追加が JSON だけで済む」ことを確認。
4. 題材選択 UI、ガイドの濃さ調整、スコア保存（Amplify）などを順次。

## Level2 以降

ノード接続（腕神経叢など）に進む際は、既存リポジトリ **nanatex**
（<https://github.com/ryusukemomota/nanatex>）のグラフデータ（ノード＋エッジ＋座標）を
正解データとして活用する。詳細は `DESIGN.md` の「9. 既存資産の活用: nanatex」参照。

## 出典・ライセンス注意

nanatex 由来データを使う場合、元データはミシガン大学医学部の解剖テーブル（Thomas R. Gest 教授の
許諾による）。派生利用時は出典明記が必要。
