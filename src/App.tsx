import { useEffect, useState, useCallback } from 'react'
import {
  ConfigProvider,
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Tag,
  Statistic,
  Badge,
  Space,
  Divider,
  Spin,
  Tooltip,
} from 'antd'
import {
  ShoppingCartOutlined,
  GiftOutlined,
  CarOutlined,
  AppstoreOutlined,
  ShopOutlined,
  TeamOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import ruRU from 'antd/locale/ru_RU'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

interface ChibbisStats {
  orders: { total: number; today: number; pending: number }
  products: { total: number; synced: number }
  syncLogs: { lastSync: string | null; errors: number }
}

interface FlowwowStats {
  totalOrders: number
  pendingOrders: number
  failedLogsLast24h: number
  sessionValid: boolean
  sessionLastUsed: string | null
}

interface AggregateData {
  chibbis1: ChibbisStats | null
  chibbis2: ChibbisStats | null
  flowwow: FlowwowStats | null
}

function timeAgo(iso: string | null): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'только что'
  if (mins < 60) return `${mins} мин назад`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} ч назад`
  return `${Math.floor(hours / 24)} дн назад`
}

function ChibbisCard({
  title,
  data,
  url,
  color,
  loading,
}: {
  title: string
  data: ChibbisStats | null
  url: string
  color: string
  loading: boolean
}) {
  const hasErrors = (data?.syncLogs.errors ?? 0) > 0

  return (
    <Card
      style={{ height: '100%', borderRadius: 12, borderTop: `3px solid ${color}` }}
      styles={{ body: { padding: 20 } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${color}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              fontSize: 20,
            }}
          >
            <ShoppingCartOutlined />
          </div>
          <div>
            <Text strong style={{ fontSize: 15 }}>{title}</Text>
            <br />
            <Tag color="green" style={{ margin: 0, fontSize: 11 }}>Chibbis</Tag>
          </div>
        </div>
        {loading ? (
          <Spin size="small" />
        ) : data ? (
          <Badge
            status={hasErrors ? 'error' : 'success'}
            text={<Text style={{ fontSize: 12 }}>{hasErrors ? 'Есть ошибки' : 'Работает'}</Text>}
          />
        ) : (
          <Badge status="default" text={<Text style={{ fontSize: 12 }}>Недоступен</Text>} />
        )}
      </div>

      {data ? (
        <>
          <Row gutter={12} style={{ marginBottom: 12 }}>
            <Col span={8}>
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Всего заказов</Text>}
                value={data.orders.total}
                valueStyle={{ fontSize: 22, color: '#1677ff' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Сегодня</Text>}
                value={data.orders.today}
                valueStyle={{ fontSize: 22, color: color }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title={<Text style={{ fontSize: 11 }}>В работе</Text>}
                value={data.orders.pending}
                valueStyle={{ fontSize: 22, color: data.orders.pending > 0 ? '#fa8c16' : '#52c41a' }}
              />
            </Col>
          </Row>

          <Divider style={{ margin: '10px 0' }} />

          <Row gutter={12} style={{ marginBottom: 12 }}>
            <Col span={12}>
              <Space size={4}>
                <ShopOutlined style={{ color: '#8c8c8c', fontSize: 13 }} />
                <Text style={{ fontSize: 12 }} type="secondary">Товаров: </Text>
                <Text style={{ fontSize: 12 }} strong>{data.products.total}</Text>
              </Space>
            </Col>
            <Col span={12}>
              <Tooltip title={`Последняя синхр: ${timeAgo(data.syncLogs.lastSync)}`}>
                <Space size={4}>
                  {hasErrors ? (
                    <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 13 }} />
                  ) : (
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 13 }} />
                  )}
                  <Text style={{ fontSize: 12 }} type="secondary">Ошибок: </Text>
                  <Text style={{ fontSize: 12, color: hasErrors ? '#ff4d4f' : '#52c41a' }} strong>
                    {data.syncLogs.errors}
                  </Text>
                </Space>
              </Tooltip>
            </Col>
          </Row>

          <Space size={4}>
            <ClockCircleOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
            <Text style={{ fontSize: 11 }} type="secondary">Синхр: {timeAgo(data.syncLogs.lastSync)}</Text>
          </Space>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px 0', color: '#bfbfbf' }}>
          <ExclamationCircleOutlined style={{ fontSize: 24, marginBottom: 8 }} />
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>Нет данных</Text>
        </div>
      )}

      <Button
        type="primary"
        block
        style={{ marginTop: 16, background: color, borderColor: color }}
        icon={<ArrowRightOutlined />}
        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      >
        Открыть панель
      </Button>
    </Card>
  )
}

function FlowwowCard({
  data,
  url,
  loading,
}: {
  data: FlowwowStats | null
  url: string
  loading: boolean
}) {
  const color = '#eb2f96'
  const hasErrors = (data?.failedLogsLast24h ?? 0) > 0

  return (
    <Card
      style={{ height: '100%', borderRadius: 12, borderTop: `3px solid ${color}` }}
      styles={{ body: { padding: 20 } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${color}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              fontSize: 20,
            }}
          >
            <GiftOutlined />
          </div>
          <div>
            <Text strong style={{ fontSize: 15 }}>Flowwow</Text>
            <br />
            <Tag color="magenta" style={{ margin: 0, fontSize: 11 }}>Flowwow</Tag>
          </div>
        </div>
        {loading ? (
          <Spin size="small" />
        ) : data ? (
          <Badge
            status={!data.sessionValid ? 'error' : hasErrors ? 'warning' : 'success'}
            text={
              <Text style={{ fontSize: 12 }}>
                {!data.sessionValid ? 'Сессия истекла' : hasErrors ? 'Есть ошибки' : 'Работает'}
              </Text>
            }
          />
        ) : (
          <Badge status="default" text={<Text style={{ fontSize: 12 }}>Недоступен</Text>} />
        )}
      </div>

      {data ? (
        <>
          <Row gutter={12} style={{ marginBottom: 12 }}>
            <Col span={12}>
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Всего заказов</Text>}
                value={data.totalOrders}
                valueStyle={{ fontSize: 22, color: '#1677ff' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title={<Text style={{ fontSize: 11 }}>В обработке</Text>}
                value={data.pendingOrders}
                valueStyle={{ fontSize: 22, color: data.pendingOrders > 0 ? '#fa8c16' : '#52c41a' }}
              />
            </Col>
          </Row>

          <Divider style={{ margin: '10px 0' }} />

          <Row gutter={12} style={{ marginBottom: 12 }}>
            <Col span={12}>
              <Space size={4}>
                {data.sessionValid ? (
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 13 }} />
                ) : (
                  <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 13 }} />
                )}
                <Text style={{ fontSize: 12 }} type="secondary">Сессия: </Text>
                <Text style={{ fontSize: 12, color: data.sessionValid ? '#52c41a' : '#ff4d4f' }} strong>
                  {data.sessionValid ? 'Активна' : 'Истекла'}
                </Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space size={4}>
                {hasErrors ? (
                  <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 13 }} />
                ) : (
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 13 }} />
                )}
                <Text style={{ fontSize: 12 }} type="secondary">Ошибок 24ч: </Text>
                <Text style={{ fontSize: 12, color: hasErrors ? '#ff4d4f' : '#52c41a' }} strong>
                  {data.failedLogsLast24h}
                </Text>
              </Space>
            </Col>
          </Row>

          <Space size={4}>
            <ClockCircleOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
            <Text style={{ fontSize: 11 }} type="secondary">Сессия: {timeAgo(data.sessionLastUsed)}</Text>
          </Space>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px 0', color: '#bfbfbf' }}>
          <ExclamationCircleOutlined style={{ fontSize: 24, marginBottom: 8 }} />
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>Нет данных</Text>
        </div>
      )}

      <Button
        type="primary"
        block
        style={{ marginTop: 16, background: color, borderColor: color }}
        icon={<ArrowRightOutlined />}
        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      >
        Открыть панель
      </Button>
    </Card>
  )
}

interface LinkPanel {
  key: string
  title: string
  description: string
  url: string
  icon: React.ReactNode
  tag: string
  tagColor: string
  color: string
}

const linkPanels: LinkPanel[] = [
  {
    key: 'yandex',
    title: 'Яндекс.Еда + Купер',
    description: 'Управление заказами из Яндекс.Еда и Купер',
    url: 'http://89.104.71.21/warehouse/',
    icon: <CarOutlined />,
    tag: 'Доставка',
    tagColor: 'orange',
    color: '#fa8c16',
  },
  {
    key: 'flawery',
    title: 'Флавери',
    description: 'Склад и заказы для бренда Флавери',
    url: 'http://89.104.71.21/warehouse_flawery/',
    icon: <ShopOutlined />,
    tag: 'Склад',
    tagColor: 'purple',
    color: '#722ed1',
  },
  {
    key: 'kuper',
    title: 'Купер',
    description: 'Заказы через платформу Купер',
    url: 'http://89.104.71.21/warehouse_kuper/',
    icon: <AppstoreOutlined />,
    tag: 'Доставка',
    tagColor: 'blue',
    color: '#1677ff',
  },
  {
    key: 'letu',
    title: 'Letu',
    description: 'Управление заказами через Letu',
    url: 'http://89.104.71.21/warehouse_letu/',
    icon: <ThunderboltOutlined />,
    tag: 'Доставка',
    tagColor: 'gold',
    color: '#faad14',
  },
  {
    key: 'turbocake',
    title: 'TurboCake',
    description: 'Заказы для TurboCake — торты и десерты',
    url: 'http://89.104.71.21/warehouse_cake/',
    icon: <GiftOutlined />,
    tag: 'Еда',
    tagColor: 'volcano',
    color: '#fa541c',
  },
  {
    key: 'orders',
    title: 'Панель заказов',
    description: 'Общая панель всех входящих заказов',
    url: 'http://89.104.71.21/panel/',
    icon: <TeamOutlined />,
    tag: 'Операции',
    tagColor: 'geekblue',
    color: '#2f54eb',
  },
  {
    key: 'erp',
    title: 'ERP',
    description: 'Аналитика и управление ресурсами',
    url: 'http://89.104.71.21/erp/',
    icon: <DatabaseOutlined />,
    tag: 'Аналитика',
    tagColor: 'lime',
    color: '#7cb305',
  },
]

export default function App() {
  const [stats, setStats] = useState<AggregateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/aggregate')
      const data: AggregateData = await res.json()
      setStats(data)
      setLastUpdated(new Date())
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return (
    <ConfigProvider locale={ruRU} theme={{ token: { colorPrimary: '#1677ff', borderRadius: 8 } }}>
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Header
          style={{
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AppstoreOutlined style={{ fontSize: 20, color: '#1677ff' }} />
            <Title level={4} style={{ margin: 0 }}>Панели управления</Title>
          </div>
          <Space>
            {lastUpdated && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Обновлено: {lastUpdated.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
            <Button
              size="small"
              icon={<ReloadOutlined spin={loading} />}
              onClick={fetchStats}
              disabled={loading}
            >
              Обновить
            </Button>
          </Space>
        </Header>

        <Content style={{ padding: '24px 20px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>

          {/* Живые панели с данными */}
          <div style={{ marginBottom: 20 }}>
            <Title level={5} style={{ marginBottom: 12, color: '#595959' }}>
              Интеграции с данными
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <ChibbisCard
                  title="Chibbis"
                  data={stats?.chibbis1 ?? null}
                  url="https://soothing-insight-production-8757.up.railway.app/"
                  color="#52c41a"
                  loading={loading}
                />
              </Col>
              <Col xs={24} md={8}>
                <ChibbisCard
                  title="Chibbis (5 цветов)"
                  data={stats?.chibbis2 ?? null}
                  url="https://frontend-chibbis2-production.up.railway.app/"
                  color="#13c2c2"
                  loading={loading}
                />
              </Col>
              <Col xs={24} md={8}>
                <FlowwowCard
                  data={stats?.flowwow ?? null}
                  url="https://zonal-curiosity-production-2157.up.railway.app/"
                  loading={loading}
                />
              </Col>
            </Row>
          </div>

          {/* Остальные панели — только ссылки */}
          <div>
            <Title level={5} style={{ marginBottom: 12, color: '#595959' }}>
              Остальные панели
            </Title>
            <Row gutter={[16, 16]}>
              {linkPanels.map((p) => (
                <Col key={p.key} xs={24} sm={12} lg={8} xl={6}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 12,
                      borderTop: `3px solid ${p.color}`,
                      cursor: 'pointer',
                    }}
                    styles={{ body: { padding: 16 } }}
                    onClick={() => window.open(p.url, '_blank', 'noopener,noreferrer')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: `${p.color}18`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: p.color,
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        {p.icon}
                      </div>
                      <div>
                        <Text strong style={{ fontSize: 14 }}>{p.title}</Text>
                        <br />
                        <Tag color={p.tagColor} style={{ margin: 0, fontSize: 10 }}>{p.tag}</Tag>
                      </div>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{p.description}</Text>
                    <div style={{ marginTop: 10 }}>
                      <Button
                        type="link"
                        size="small"
                        icon={<ArrowRightOutlined />}
                        style={{ padding: 0, color: p.color }}
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(p.url, '_blank', 'noopener,noreferrer')
                        }}
                      >
                        Открыть
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', color: '#bfbfbf', fontSize: 12, background: '#f5f5f5' }}>
          Панели управления © {new Date().getFullYear()} — обновляется каждую минуту
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}
