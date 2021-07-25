import {
  LinkOutlined, FacebookOutlined, TwitterOutlined, InstagramOutlined,
  GithubOutlined, MailOutlined, RedditOutlined
} from '@ant-design/icons';

import { IconId } from '@tezospayments/common/dist/helpers';

import { TelegramIcon } from '../../../assets/icons';

export const iconIdMap = {
  [IconId.Common]: LinkOutlined,
  [IconId.Email]: MailOutlined,
  [IconId.Telegram]: TelegramIcon,
  [IconId.Facebook]: FacebookOutlined,
  [IconId.Twitter]: TwitterOutlined,
  [IconId.Instagram]: InstagramOutlined,
  [IconId.GitHub]: GithubOutlined,
  [IconId.Reddit]: RedditOutlined
};
