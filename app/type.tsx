export interface sourceItem {
  cover: string;
  play_url: string;
  title: string;
}

export interface videoData {
  items: Array<sourceItem>
}